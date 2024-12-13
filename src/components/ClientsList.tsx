import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo, useEffect } from "react";
import { utils, writeFile } from "xlsx";
import { AssignClientsDialog } from "./clients/AssignClientsDialog";
import { ClientsListHeader } from "./clients/list/ClientsListHeader";
import { ClientsListTable } from "./clients/list/ClientsListTable";
import { ClientsPagination } from "./clients/list/ClientsPagination";
import type { RowsPerPage } from "./clients/ClientsRowsPerPage";
import { cn } from "@/lib/utils";
import { useClientDeletion } from "./clients/list/ClientsDeleteHandler";
import { toast } from "sonner";
import { ClientsFilters } from "./clients/list/ClientsFilters";
import { LocalClientStorage } from "@/lib/localClientStorage";

interface ClientsListProps {
  status: string;
  searchQuery?: string;
  showFavorites?: boolean;
  selectedUser?: string | null;
  refreshTrigger?: number;
  onImportComplete?: () => void;
  onClientClick?: (client: any) => void;
}

export function ClientsList({ 
  status, 
  searchQuery: externalSearchQuery = "", 
  showFavorites: externalShowFavorites = false,
  selectedUser: externalSelectedUser = null,
  refreshTrigger = 0,
  onImportComplete,
  onClientClick
}: ClientsListProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [userRole, setUserRole] = useState<string>("admin"); // Default to admin for local storage version
  const { deleteClients } = useClientDeletion();
  const clientStorage = new LocalClientStorage();
  
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedUser, setSelectedUser] = useState<string | null>(externalSelectedUser);
  const [showFavorites, setShowFavorites] = useState(externalShowFavorites);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load clients from local storage
  useEffect(() => {
    let isMounted = true;

    const loadClients = async () => {
      try {
        if (!clientStorage) return;
        
        const allClients = await clientStorage.getAllClients();
        if (!isMounted) return;

        console.log('Current status:', status);
        const filteredClients = allClients.filter(client => {
          // For "all" status, show all clients
          if (status === "all") return true;
          
          // Otherwise filter by status
          if (!client || !client.status) return false;
          return client.status.toLowerCase() === status.toLowerCase();
        });

        if (!isMounted) return;
        console.log('Filtered clients:', filteredClients);
        setClients(filteredClients);
      } catch (err: any) {
        console.error('Error loading clients:', err);
        if (isMounted) {
          setError(err);
        }
      }
    };

    loadClients();
    return () => {
      isMounted = false;
    };
  }, [status, refreshTrigger, clientStorage]);

  // Remove postMessage error
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        window.location.origin,
        'http://localhost:3000',
        'http://192.168.1.110:5173'
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.log('Ignored message from untrusted origin:', event.origin);
        return;
      }

      // Handle the message here
      console.log('Received message from trusted origin:', event.origin);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update internal state when external props change
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  useEffect(() => {
    setShowFavorites(externalShowFavorites);
  }, [externalShowFavorites]);

  useEffect(() => {
    setSelectedUser(externalSelectedUser);
  }, [externalSelectedUser]);

  const toggleFavorite = async (clientId: string) => {
    try {
      const userId = 'local-user';
      if (favorites.includes(clientId)) {
        const newFavorites = favorites.filter(id => id !== clientId);
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      } else {
        const newFavorites = [...favorites, clientId];
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      }
      
      toast.success(t(favorites.includes(clientId) ? 'clients.removedFromFavorites' : 'clients.addedToFavorites'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t('errors.unexpected'));
    }
  };

  // Load favorites from local storage
  useEffect(() => {
    const userId = 'local-user';
    const storedFavorites = localStorage.getItem(`favorites_${userId}`);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Filter clients based on search query, favorites, and selected user
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = searchQuery
        ? Object.values(client).some(value => 
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      const matchesUser = selectedUser
        ? client.userId === selectedUser || client.assignedTo === selectedUser
        : true;

      const matchesFavorites = showFavorites
        ? favorites.includes(client.id)
        : true;

      return matchesSearch && matchesUser && matchesFavorites;
    });
  }, [clients, searchQuery, selectedUser, showFavorites, favorites]);

  // Calculate displayedClients
  const displayedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredClients.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredClients, currentPage, rowsPerPage]);

  const handleSelectAll = useCallback(() => {
    setSelectedClients(prev => 
      prev.length === displayedClients.length ? [] : displayedClients.map(client => client.id)
    );
  }, [displayedClients]);

  const handleSelectClient = useCallback((clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  }, []);

  const handleRowsPerPageChange = useCallback((value: RowsPerPage) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  }, []);

  const exportToExcel = async (selectedOnly: boolean = false) => {
    try {
      const dataToExport = selectedOnly ? 
        clients.filter(client => selectedClients.includes(client.id)) : 
        clients;

      const worksheet = utils.json_to_sheet(dataToExport.map(client => ({
        Name: client.name,
        Phone: client.phone,
        Email: client.email,
        Facebook: client.facebook,
        Country: client.country,
        City: client.city,
        Project: client.project,
        Status: t(`clients.status.${client.status}`)
      })));

      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Clients");
      
      writeFile(workbook, `clients_export_${new Date().toISOString()}.xlsx`);
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      toast.error(t('errors.exportFailed'));
    }
  };

  const handleRowClick = useCallback((client: any) => {
    try {
      // Add loading state
      setIsLoading(true);
      
      // Process click after a small delay to prevent UI freeze
      setTimeout(() => {
        if (onClientClick) {
          onClientClick(client);
        }
        setIsLoading(false);
      }, 0);
    } catch (error) {
      console.error('Error handling row click:', error);
      setIsLoading(false);
    }
  }, [onClientClick]);

  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  const isAllSelected = useMemo(() => 
    displayedClients.length > 0 && selectedClients.length === displayedClients.length,
    [displayedClients.length, selectedClients.length]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedClients([]);
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className={cn(
      "space-y-4",
      isRTL && "font-cairo"
    )} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-4">
        <ClientsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedUser={selectedUser}
          onUserChange={setSelectedUser}
          showFavorites={showFavorites}
          onFavoritesChange={setShowFavorites}
        />

        <ClientsListHeader
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          selectedClients={selectedClients}
          onExportAll={() => exportToExcel(false)}
          onExportSelected={() => exportToExcel(true)}
          onUnassign={() => setSelectedClients([])}
          onAssign={() => setIsAssignDialogOpen(true)}
          onDelete={() => deleteClients(selectedClients)}
          userRole={userRole}
        />
      </div>

      <ClientsListTable
        clients={displayedClients}
        selectedClients={selectedClients}
        onSelectAll={handleSelectAll}
        onSelectClient={handleSelectClient}
        isAllSelected={isAllSelected}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onRowClick={handleRowClick}
      />

      <ClientsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AssignClientsDialog 
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        clientIds={selectedClients}
        onSuccess={() => {
          setSelectedClients([]);
          setIsAssignDialogOpen(false);
        }}
      />
    </div>
  );
}