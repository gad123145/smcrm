import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getSidebarItems } from "@/data/sidebarItems";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ImportClientsSheet } from "../ImportClientsSheet";
import { AddClientForm } from "../AddClientForm";
import { ScrollArea } from "@/components/ui/scroll-area";

type DashboardSidebarProps = {
  open: boolean;
};

export function DashboardSidebar({ open }: DashboardSidebarProps) {
  const { t, i18n } = useTranslation();
  const [sidebarItems, setSidebarItems] = useState([]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const loadSidebarItems = async () => {
      const items = await getSidebarItems();
      setSidebarItems(items);
    };
    loadSidebarItems();
  }, []);

  return (
    <aside
      className={cn(
        "fixed top-14 bottom-0 z-30 flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-0",
        isRTL ? "right-0 border-l" : "left-0 border-r"
      )}
    >
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {/* Client Actions */}
        <div className="space-y-2 mb-6">
          <AddClientForm defaultStatus="new">
            <Button
              variant="default"
              className={cn(
                "w-full justify-start gap-2",
                isRTL ? "text-right" : "text-left"
              )}
            >
              {t("nav.addClient")}
            </Button>
          </AddClientForm>

          <ImportClientsSheet>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-2",
                isRTL ? "text-right" : "text-left"
              )}
            >
              {t("nav.importClients")}
            </Button>
          </ImportClientsSheet>
        </div>

        {/* Regular Menu Items */}
        {sidebarItems.map((item, index) => (
          <div 
            key={item.label} 
            className={cn(
              "py-1",
              index === 0 ? "" : 
              index === 5 ? "mt-6" : 
              index === 7 ? "mt-6" : 
              "mt-1"
            )}
          >
            {item.hasSubmenu ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 font-medium",
                      isRTL ? "text-right" : "text-left"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>{t(item.label)}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? "end" : "start"}
                  side="right"
                  className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                >
                  <ScrollArea className="h-[300px]">
                    {item.submenu?.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.label}
                        className="flex items-center gap-2 dark:text-gray-200 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        asChild
                      >
                        <Link 
                          to={`/clients/${subItem.label.split('.')[1]}`}
                          className={cn(
                            "flex items-center gap-2 w-full",
                            isRTL ? "text-right" : "text-left"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>{t(subItem.label)}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 font-medium group",
                  isRTL ? "text-right" : "text-left"
                )}
                asChild
              >
                <Link 
                  to={item.path}
                  className="flex items-center gap-3"
                >
                  <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
                  <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>{t(item.label)}</span>
                </Link>
              </Button>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white",
            isRTL ? "flex-row-reverse" : ""
          )}
          asChild
        >
          <Link to="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("nav.settings")}
          </Link>
        </Button>
      </div>
    </aside>
  );
}