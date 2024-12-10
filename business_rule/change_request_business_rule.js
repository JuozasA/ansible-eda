(function executeRule(current, previous /*null when async*/ ) {
    try {
        var credentialsProvider = new sn_cc.StandardCredentialsProvider();
        var credential = credentialsProvider.getCredentialByID('20a6268dc3ca16101966de1d05013152');
        var token = credential.getAttribute('password');
        if (!token) {
            gs.error("Failed to retrieve API token from credentials.");
            return;
        }

        var r = new sn_ws.RESTMessageV2();
        // Enter EDA URL and port number here. In this one we have eda.example.com port 5000.
        r.setEndpoint("https://eda.amazonaws.com:5001/endpoint");
        r.setHttpMethod("post");
        r.setRequestHeader("Authorization", "Bearer " + token);
        r.setRequestHeader("Content-Type", "application/json");

        // Get data from Incident record

        var ci = new GlideRecord('cmdb_ci');
        ci.get('sys_id', current.getValue("cmdb_ci"));
        var cmdb_ci = ci.getValue('name');
        var number = current.getValue("number");
        var short_description = current.getValue("short_description");
        var cmdb_ci_id = current.getValue("cmdb_ci");
        var cr_id = current.getValue("sys_id");

        var obj = {
            "number": number,
            "description": short_description,
            "ci_name": cmdb_ci,
            "ci_id": cmdb_ci_id,
            "cr_id": cr_id,
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
