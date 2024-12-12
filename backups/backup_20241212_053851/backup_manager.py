import os
import shutil
import datetime
import sys
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox
from threading import Thread

class BackupManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Backup Manager")
        self.root.geometry("600x400")
        
        # Create main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Status label
        self.status_var = tk.StringVar(value="Ready to backup")
        self.status_label = ttk.Label(self.main_frame, textvariable=self.status_var)
        self.status_label.grid(row=0, column=0, columnspan=2, pady=10)
        
        # Progress bar
        self.progress = ttk.Progressbar(self.main_frame, mode='indeterminate')
        self.progress.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        # Backup button
        self.backup_button = ttk.Button(self.main_frame, text="Create Backup", command=self.start_backup)
        self.backup_button.grid(row=2, column=0, columnspan=2, pady=10)
        
        # List of backups
        self.backup_list = tk.Listbox(self.main_frame, height=10, width=70)
        self.backup_list.grid(row=3, column=0, columnspan=2, pady=10)
        
        self.refresh_backup_list()
        
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
                self.backup_list.insert(tk.END, f"{backup} - {size_mb:.2f} MB")
    
    def start_backup(self):
        self.backup_button.state(['disabled'])
        self.progress.start()
        self.status_var.set("Creating backup...")
        Thread(target=self.create_backup).start()
    
    def create_backup(self):
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
            
            # Delete old backups (keep only last 5)
            all_backups = sorted([
                d for d in os.listdir(backup_dir)
                if os.path.isdir(os.path.join(backup_dir, d))
            ])
            if len(all_backups) > 5:
                for old_backup in all_backups[:-5]:
                    old_backup_path = os.path.join(backup_dir, old_backup)
                    shutil.rmtree(old_backup_path)
            
            self.root.after(0, self.backup_completed, backup_folder)
            
        except Exception as e:
            self.root.after(0, self.backup_failed, str(e))
    
    def backup_completed(self, backup_folder):
        self.progress.stop()
        self.backup_button.state(['!disabled'])
        self.status_var.set("Backup completed successfully!")
        self.refresh_backup_list()
        messagebox.showinfo("Success", f"Backup created successfully!\nLocation: {backup_folder}")
    
    def backup_failed(self, error):
        self.progress.stop()
        self.backup_button.state(['!disabled'])
        self.status_var.set("Backup failed!")
        messagebox.showerror("Error", f"Failed to create backup: {error}")

def main():
    root = tk.Tk()
    app = BackupManager(root)
    root.mainloop()

if __name__ == "__main__":
    main()
