(function executeRule(current, previous /*null when async*/) {
    // Check if Configuration Item, Number, or Description fields are populated
    if (!current.cmdb_ci || !current.number || !current.description) {
        gs.error("Required fields are missing. REST API call aborted.");
        return;
    }

    // Retrieve the API token securely
	
	var gr = new GlideRecord("sys_credentials");
	gr.get("name", "EDA_Token_Credential");
	var token = gr.password; // The token is stored in the password field
	if (!token) {
		gs.error("Failed to retrieve API token from credentials.");
		return;
	}

    // REST API details
    var endpoint = "https://eda-controller-aap.apps.cluster-kk69t.kk69t.sandbox799.opentlc.com/endpoint";

    // Prepare the payload
    var payload = {
        "incident_number": current.number.toString(),
        "description": current.description.toString(),
        "ci": current.cmdb_ci.getDisplayValue() // Fetch CI display value
    };

    // Set up RESTMessageV2
    var restMessage = new sn_ws.RESTMessageV2();
    restMessage.setEndpoint(endpoint);
    restMessage.setHttpMethod("POST");

    // Add headers for authentication and content type
    restMessage.setRequestHeader("Authorization", "Bearer " + token);
    restMessage.setRequestHeader("Content-Type", "application/json");

    // Set the payload as a JSON string
    restMessage.setRequestBody(JSON.stringify(payload));

    try {
        // Execute the REST API call
        var response = restMessage.execute();
        var httpStatus = response.getStatusCode();
        var responseBody = response.getBody();

        // Log success or error based on the status code
        if (httpStatus === 200 || httpStatus === 201) {
            gs.info("Incident sent successfully: " + current.number);
            gs.info("Response: " + responseBody);
        } else {
            gs.error("Failed to send incident. HTTP Status: " + httpStatus);
            gs.error("Response: " + responseBody);
        }
    } catch (ex) {
        gs.error("Error occurred during REST API call: " + ex.message);
    }
})(current, previous);