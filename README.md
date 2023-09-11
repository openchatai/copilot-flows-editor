# Flows Editor


By default, OpenCopilot attempts to map the user's request to an endpoint automatically, and this works well for most simple use cases. However, if your backend contains flows that are not straightforward or intuitive, you may need to define these flows using OpenCopilot's definitions.

## What is a Flow?

A flow consists of a series of steps, where each step represents an API call to your backend. Each flow has a name and description to guide the copilot in determining when to invoke it based on the user's request.

For example, imagine that your system includes an "add to cart" functionality, which involves calling multiple endpoints. You may want your copilot to handle user requests that require this functionality. To achieve this, you need to define a flow using OpenCopilot's flow definitions.

![example-flow](https://github.com/openchatai/editor/assets/32633162/5d8c0ddf-dbda-4c03-97d0-94d0aaf9128d)

**In this example:**

1. The user requested the copilot to add 3 sunglasses to the cart.

2. OpenCopilot automatically mapped the user request to the pre-defined "create cart" flow, passing the necessary parameters based on the user request.

3. After making all the API calls, OpenCopilot responds to the user based on the results of the flow.

## How to Define Your OpenCopilot Flows File

First, ensure that your copilot has a valid Swagger file. Typically, when you create a new copilot, you will need to upload a valid Swagger file.

We have developed a [simple tool](https://editor.opencopilot.so) to assist you in writing your OpenCopilot flow definitions. In the following example, we have created a flow for cart creation. Take a look at it.


![flows-file-example](https://github.com/openchatai/editor/assets/32633162/90b0c6a0-80eb-4a8d-b7a7-6f122e4bba63)



Notice that each step have `open_api_operation_id`, which refer to your swagger file, from there the copilot knows exactly what is the endpoint details, params, base url, etc..

We have prepared a set of endpoints to help you create these flows.

## Flows Best Practices

Flows are still in beta, and there are some areas where they currently lack functionality. To make the most of flows in OpenCopilot, ensure that your flow definition files always align with your Swagger file in terms of `open_api_operation_id`. Additionally, try to minimize the response data from each step (only pass the important fields between steps, not the entire API response).

If you have a specific use case and need support from our team, we would love to assist you. Please join our Discord server or schedule a call with us.

## Suggestions and Questions ❤️

OpenCopilot flow definition is new and still in beta. We highly appreciate your suggestions. You can join our [Discord server](https://discord.gg/yjEgCgvefr), [hey@openchat.so](mailto:hey@openchat.so)email us, or [book a call](https://calendly.com/hey-pk0) with us to share your feedback.


