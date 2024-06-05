
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

push:
	@echo "Adding all in github"
	@git add .

	@echo "Commiting all"
	@git commit -m %1

	@echo "Pushing all"
	@git push origin master

.PHONY: all install-frontend install-backend test
