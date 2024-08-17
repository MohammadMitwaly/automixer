#!/bin/bash

# Change this to your target directory, or use `.` for the current directory
DIR="/home/altooro_developer/Documents/Songs/Temp"

# Initialize a counter
counter=1

# Loop over all files in the directory
for file in "$DIR"/*; do
    # Extract the file extension
    extension="${file##*.}"
    
    # Rename the file to trackN.mp3
    mv "$file" "$DIR/track$counter.mp3"
    
    # Increment the counter
    ((counter++))
done