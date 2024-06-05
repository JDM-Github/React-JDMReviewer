
FRONTEND_DIR=client
BACKEND_DIR=server

all: install-frontend install-backend

install-frontend:
	@echo "Installing frontend dependencies..."
	cd $(BACKEND_DIR) && npm install react-router-dom
	cd $(BACKEND_DIR) && npm install sass
	cd $(BACKEND_DIR) && npm install axios

install-backend:
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install nodemon --save-dev
	cd $(BACKEND_DIR) && npm install express
	cd $(BACKEND_DIR) && npm install cors
	cd $(BACKEND_DIR) && npm install mysql2

# Push changes to the remote repository
# Usage: make push message="Your commit message"
push:
	@echo "Adding all changes to the local repository"
	@git add .

	@echo "Committing all changes with message: $(message)"
	@git commit -m "$(message)"

	@echo "Pushing all changes to the remote repository"
	@git push origin master

.PHONY: all install-frontend install-backend test
