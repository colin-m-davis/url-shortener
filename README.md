# URL Shortener
By sending a POST request to the `` endpoint with a URL string, the app responds with a newly generated id `id` that now links to the URL.
When the user makes a GET request to the `/go/{id}` endpoint, the app redirects the user to the previously inputted URL.
This is a CDK app that deploys AWS API Gateway, Lambda, and DynamoDB resources.
