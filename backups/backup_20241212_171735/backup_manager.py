import os
import shutil
import datetime
import sys
import json
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox
from threading import Thread

class BackupManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Backup Manager")
        self.root.geometry("800x600")
        
        # Create main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Status label
        self.status_var = tk.StringVar(value="Ready to backup")
        self.status_label = ttk.Label(self.main_frame, textvariable=self.status_var)
        self.status_label.grid(row=0, column=0, columnspan=3, pady=10)
        
        # Description frame
        desc_frame = ttk.LabelFrame(self.main_frame, text="Backup Description", padding="5")
        desc_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        self.description = tk.Text(desc_frame, height=3, width=70)
        self.description.pack(fill=tk.X, expand=True)
        
        # Progress bar
        self.progress = ttk.Progressbar(self.main_frame, mode='indeterminate')
        self.progress.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        # Buttons frame
        btn_frame = ttk.Frame(self.main_frame)
        btn_frame.grid(row=3, column=0, columnspan=3, pady=10)
        
        # Backup button
        self.backup_button = ttk.Button(btn_frame, text="Create Backup", command=self.start_backup)
        self.backup_button.pack(side=tk.LEFT, padx=5)
        
        # Restore button
        self.restore_button = ttk.Button(btn_frame, text="Restore Backup", command=self.restore_backup)
        self.restore_button.pack(side=tk.LEFT, padx=5)
        
        # List of backups with scrollbar
        list_frame = ttk.Frame(self.main_frame)
        list_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        self.backup_list = tk.Listbox(list_frame, height=15, width=90)
        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.backup_list.yview)
        self.backup_list.configure(yscrollcommand=scrollbar.set)
        
        self.backup_list.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Load backup metadata
        self.backup_metadata = self.load_metadata()
        self.refresh_backup_list()
    
    def load_metadata(self):
        metadata_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups', 'metadata.json')
        if os.path.exists(metadata_file):
            try:
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def save_metadata(self):
        metadata_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups', 'metadata.json')
        os.makedirs(os.path.dirname(metadata_file), exist_ok=True)
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.backup_metadata, f, ensure_ascii=False, indent=2)
    
    def refresh_backup_list(self):
        self.backup_list.delete(0, tk.END)
        backup_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups')
        if os.path.exists(backup_dir):
            backups = sorted([d for d in os.listdir(backup_dir) if os.path.isdir(os.path.join(backup_dir, d))], reverse=True)
            for backup in backups:
                backup_path = os.path.join(backup_dir, backup)
                size = sum(
                    sum(os.path.getsize(os.path.join(dirpath, filename))
                        for filename in filenames)
                    for dirpath, _, filenames in os.walk(backup_path)
                )
                size_mb = size / (1024 * 1024)
                description = self.backup_metadata.get(backup, {}).get('description', '')
                self.backup_list.insert(tk.END, f"{backup} - {size_mb:.2f} MB - {description}")
    
    def start_backup(self):
        description = self.description.get("1.0", tk.END).strip()
        if not description:
            if not messagebox.askyesno("No Description", "Do you want to create backup without description?"):
                return
        
        self.backup_button.state(['disabled'])
        self.restore_button.state(['disabled'])
        self.progress.start()
        self.status_var.set("Creating backup...")
        Thread(target=lambda: self.create_backup(description)).start()
    
    def create_backup(self, description):
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            backup_dir = os.path.join(current_dir, 'backups')
            
            if not os.path.exists(backup_dir):
                os.makedirs(backup_dir)
            
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_folder = os.path.join(backup_dir, f'backup_{timestamp}')
            
            os.makedirs(backup_folder)
            
            exclude = {
                'node_modules',
                'backups',
                '.git',
                '__pycache__',
                'dist',
                'build',
                '.next',
                'venv',
                'env'
            }
            
            for item in os.listdir(current_dir):
                if item not in exclude:
                    source = os.path.join(current_dir, item)
                    destination = os.path.join(backup_folder, item)
                    
                    if os.path.isdir(source):
                        shutil.copytree(source, destination)
                        self.status_var.set(f"Copying directory: {item}")
                    else:
                        shutil.copy2(source, destination)
                        self.status_var.set(f"Copying file: {item}")
            
            # Save description in metadata
            backup_name = os.path.basename(backup_folder)
            self.backup_metadata[backup_name] = {
                'description': description,
                'timestamp': timestamp
            }
            self.save_metadata()
            
            # Delete old backups (keep only last 5)
            all_backups = sorted([
                d for d in os.listdir(backup_dir)
                if os.path.isdir(os.path.join(backup_dir, d))
            ])
            if len(all_backups) > 5:
                for old_backup in all_backups[:-5]:
                    old_backup_path = os.path.join(backup_dir, old_backup)
                    shutil.rmtree(old_backup_path)
                    if old_backup in self.backup_metadata:
                        del self.backup_metadata[old_backup]
                self.save_metadata()
            
            self.root.after(0, self.backup_completed, backup_folder)
            
        except Exception as e:
            self.root.after(0, self.backup_failed, str(e))
    
    def restore_backup(self):
        selection = self.backup_list.curselection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a backup to restore")
            return
        
        backup_info = self.backup_list.get(selection[0])
        backup_name = backup_info.split(" - ")[0]
        
        if messagebox.askyesno("Confirm Restore", "Are you sure you want to restore this backup? This will overwrite your current files."):
            self.backup_button.state(['disabled'])
            self.restore_button.state(['disabled'])
            self.progress.start()
            self.status_var.set("Restoring backup...")
            Thread(target=lambda: self.perform_restore(backup_name)).start()
    
    def perform_restore(self, backup_name):
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            backup_path = os.path.join(current_dir, 'backups', backup_name)
            
            # Delete current files (except excluded ones)
            exclude = {
                'node_modules',
                'backups',
                '.git',
                '__pycache__',
                'dist',
                'build',
                '.next',
                'venv',
                'env'
            }
            
            for item in os.listdir(current_dir):
                if item not in exclude:
                    path = os.path.join(current_dir, item)
                    if os.path.isdir(path):
                        shutil.rmtree(path)
                    else:
                        os.remove(path)
            
            # Copy files from backup
            for item in os.listdir(backup_path):
                source = os.path.join(backup_path, item)
                destination = os.path.join(current_dir, item)
                
                if os.path.isdir(source):
                    shutil.copytree(source, destination)
                    self.status_var.set(f"Restoring directory: {item}")
                else:
                    shutil.copy2(source, destination)
                    self.status_var.set(f"Restoring file: {item}")
            
            self.root.after(0, self.restore_completed)
            
        except Exception as e:
            self.root.after(0, self.restore_failed, str(e))
    
    def backup_completed(self, backup_folder):
        self.progress.stop()
        self.backup_button.state(['!disabled'])
        self.restore_button.state(['!disabled'])
        self.status_var.set("Backup completed successfully!")
        self.description.delete("1.0", tk.END)
        self.refresh_backup_list()
        messagebox.showinfo("Success", f"Backup created successfully!\nLocation: {backup_folder}")
    
    def backup_failed(self, error):
        self.progress.stop()
        self.backup_button.state(['!disabled'])
        self.restore_button.state(['!disabled'])
        self.status_var.set("Backup failed!")
        messagebox.showerror("Error", f"Failed to create backup: {error}")
    
    def restore_completed(self):
        self.progress.stop()
        self.backup_button.state(['!disabled'])
        self.restore_button.state(['!disabled'])
        self.status_var.set("Restore completed successfully!")
        messagebox.showinfo("Success", "Backup restored successfully!")
    
    def restore_failed(self, error):
        self.progress.stop()
        self.backup_button.state(['!disabled'])
        self.restore_button.state(['!disabled'])
        self.status_var.set("Restore failed!")
        messagebox.showerror("Error", f"Failed to restore backup: {error}")

def main():
    root = tk.Tk()
    app = BackupManager(root)
    root.mainloop()

if __name__ == "__main__":
    main()
