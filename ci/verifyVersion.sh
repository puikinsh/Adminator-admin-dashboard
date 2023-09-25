VERSION=$1
TAG_EXISTS=$(git ls-remote --tags origin $VERSION | wc -l)

if [ $TAG_EXISTS -eq "1" ]; then
   echo "The tag '$VERSION' already exists. Please update version in package.json.";
   exit 1;
fi

echo "The tag '$VERSION' does not exist - success.";