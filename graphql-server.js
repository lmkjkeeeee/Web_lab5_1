const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Схема GraphQL
const schema = buildSchema(`
    type Product {
        id: Int
        title: String
        price: Float
    }

    type Query {
        getProducts: [Product]
        getProduct(id: Int!): Product
    }

    type Mutation {
        addProduct(title: String!, price: Float!): Product
    }
`);

// Дані
let products = [
    { id: 1, title: 'Продукт 1', price: 100 },
    { id: 2, title: 'Продукт 2', price: 200 },
];

// Резолвери
const root = {
    getProducts: () => products,
    getProduct: ({ id }) => products.find(product => product.id === id),
    addProduct: ({ title, price }) => {
        const newProduct = { id: products.length + 1, title, price };
        products.push(newProduct);
        return newProduct;
    },
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`GraphQL API доступний за адресою http://localhost:${PORT}/graphql`);
});


/*

1) Отримати список продуктів

query {
    getProducts {
        id
        title
        price
    }
}

2) Отримати продукт за ID

query {
    getProduct(id: 1) {
        id
        title
        price
    }
}

3) Додати новий продукт

mutation {
    addProduct(title: "Продукт 3", price: 250) {
        id
        title
        price
    }
}

*/