import os
import shutil
import datetime
import sys
from pathlib import Path

def create_backup():
    # Get current project directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create backup directory if it doesn't exist
    backup_dir = os.path.join(current_dir, 'backups')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    # Create backup folder name with timestamp
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_folder = os.path.join(backup_dir, f'backup_{timestamp}')
    
    try:
        print(f"Starting backup in: {backup_folder}")
        
        # Create new backup directory
        os.makedirs(backup_folder)
        
        # List of directories and files to exclude
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
        
        # Copy files and directories
        for item in os.listdir(current_dir):
            if item not in exclude:
                source = os.path.join(current_dir, item)
                destination = os.path.join(backup_folder, item)
                
                try:
                    if os.path.isdir(source):
                        shutil.copytree(source, destination)
                        print(f"Copied directory: {item}")
                    else:
                        shutil.copy2(source, destination)
                        print(f"Copied file: {item}")
                except Exception as e:
                    print(f"Error copying {item}: {str(e)}")
        
        # Calculate backup size
        total_size = sum(
            sum(os.path.getsize(os.path.join(dirpath, filename))
                for filename in filenames)
            for dirpath, _, filenames in os.walk(backup_folder)
        )
        size_mb = total_size / (1024 * 1024)
        
        print(f"\nBackup created successfully!")
        print(f"Location: {backup_folder}")
        print(f"Size: {size_mb:.2f} MB")
        
        # Delete old backups (keep only last 5)
        all_backups = sorted([
            d for d in os.listdir(backup_dir)
            if os.path.isdir(os.path.join(backup_dir, d))
        ])
        if len(all_backups) > 5:
            for old_backup in all_backups[:-5]:
                old_backup_path = os.path.join(backup_dir, old_backup)
                shutil.rmtree(old_backup_path)
                print(f"Deleted old backup: {old_backup}")
        
    except Exception as e:
        print(f"Error creating backup: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    create_backup()
