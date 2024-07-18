echo "Building app..."
npm run build
echo "Deploy files to server..."
sshpass -p 'Loc1009@2003Abc' scp build/* root@157.230.35.249:/var/www/html/
echo "Done!"
