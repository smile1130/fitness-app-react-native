#!/bin/bash

branch=$1
echo "The value of branch is: $branch"

# Android
# Increment the version code
current_version_code=$(grep "versionCode" android/app/build.gradle | grep -oP 'versionCode \K\d+')
new_version_code=$((current_version_code + 1))
sed -i "s/versionCode $current_version_code/versionCode $new_version_code/g" android/app/build.gradle

# Increment the version name
currentVersion=$(grep -oP 'versionName "\K(.*)(?=")' android/app/build.gradle)

# Increment patch version by 1
newVersion=$(echo $currentVersion | awk -F. -v OFS=. '{++$3; print}')

# Update the versionName in build.gradle
sed -i "s/versionName \"$currentVersion\"/versionName \"$newVersion\"/" android/app/build.gradle

#iOS

# declare -A file_paths
# file_paths["master"]="ios/CoachPlus.xcodeproj/project.pbxproj"
# file_paths["vtprogram"]="ios/VTProgram.xcodeproj/project.pbxproj"

# file=${file_paths[$branch]}

file="ios/${2}/project.pbxproj"

if [ -z "$file" ]; then
    echo "File path not found for the branch: $branch"
    exit 1
fi

# make sure the file exists
if [ ! -f "$file" ]; then
    echo "File not found: $file"
    exit 1
fi

# increment all CURRENT_PROJECT_VERSIONs and MARKETING_VERSIONs in the $file
perl -i -pe 's/(CURRENT_PROJECT_VERSION = )(\d+)/$1 . ($2+1)/ge' "$file"
perl -i -pe 's/(MARKETING_VERSION = 1\.0\.)(\d+)/$1 . ($2+1)/ge' "$file"

echo "Updated all CURRENT_PROJECT_VERSIONs and MARKETING_VERSIONs in $file"
