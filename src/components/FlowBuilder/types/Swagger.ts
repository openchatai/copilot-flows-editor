interface Info {
    title: string;
    version: string;
}

interface Response {
    description: string;
    content: {
        [contentType: string]: any;
    };
}

interface RequestBody {
    required?: boolean;
    content: {
        [contentType: string]: {
            schema: any;
        };
    };
}

// Operation Object
interface Operation {
    tags?: string[];
    summary?: string;
    description?: string;
    operationId?: string;
    parameters?: Array<{
        name: string;
        in: 'query' | 'header' | 'path' | 'cookie';
    }>;
    requestBody?: RequestBody;
    responses: {
        [statusCode: string]: Response;
    };
    // ... Add other properties as needed
}

// PathItem Object
interface PathItem {
    get?: Operation;
    post?: Operation;
    put?: Operation;
    delete?: Operation;
}

// Paths Object
export type Paths = {
    [path: string]: PathItem;
};

// Definitions Object (Schema)
interface Definitions {
    [name: string]: any; // You can define more specific types based on your needs
}

// The main Swagger Object
export interface Swagger<TPaths extends Paths = Paths, TDefinitions extends Definitions = Definitions> {
    openapi: string;
    info: Info;
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    tags?: Array<{
        name: string;
        description?: string;
    }>;
    paths: TPaths;
    definitions?: TDefinitions;
}


// transformation types

type ExtendedOperation = Operation & {
    method: string;
    operationId: string;
  };

export type TransformedPath = {
    path: string;
    methods: ExtendedOperation[];
};