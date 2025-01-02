# free_statement

docker build . -t free_statement

docker run -d --name free_statement-container -p 5050:5050 free_statement
