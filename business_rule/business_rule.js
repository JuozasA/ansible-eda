(function executeRule(current, previous /*null when async*/ ) {
    try {
        var credentialsProvider = new sn_cc.StandardCredentialsProvider();
        var credential = credentialsProvider.getCredentialByID('20a6268dc3ca16101966de1d05013151');
        var token = credential.getAttribute('password');
        if (!token) {
            gs.error("Failed to retrieve API token from credentials.");
            return;
        }

        var r = new sn_ws.RESTMessageV2();
        // Enter EDA URL and port number here. In this one we have eda.example.com port 5000.
        r.setEndpoint("http://aap-eda.2hnbk.gcp.redhatworkshops.io:5000/endpoint");
        r.setHttpMethod("post");
        r.setRequestHeader("Authorization", "Bearer " + token);
        r.setRequestHeader("Content-Type", "application/json");

        // Get data from Incident record

        var number = current.getValue("number");
        var short_description = current.getValue("short_description");
	var cmdb_ci = current.getValue("cmdb_ci");

        var obj = {
            "number": number,
            "description": short_description,
            "ci_name": cmdb_ci,
        };

        var body = JSON.stringify(obj);
        gs.info("Webhook body: " + body);
        r.setRequestBody(body);

        var response = r.execute();
        var httpStatus = response.getStatusCode();
    } catch (ex) {
        var message = ex.message;
        gs.error("Error message: " + message);
    }

    gs.info("Webhook target HTTP status response: " + httpStatus);

})(current, previous);
