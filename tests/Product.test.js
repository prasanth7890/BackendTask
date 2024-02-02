const request = require("supertest");
const app = require("../server");

const Product = require("../models/ProductSchema");

describe("ProductController API Endpoints", () => {
  let productId;

  describe("GET /products", () => {
    test("should get all products", async () => {
      const response = await request(app).get("/api/v1/products");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("GET /products/:id", () => {
    test("should get a single product", async () => {
      const product = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
      });

      const response = await request(app).get(
        `/api/v1/products/${product._id}`
      );
      await Product.deleteOne({ _id: product._id });

      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(product._id.toString());
    });

    test("should get a error message", async () => {
      const response = await request(app).get(`/api/v1/products/${productId}`);

      expect(response.status).toBe(500);
      expect(response.body.msg);
    });
  });

  describe("POST /products", () => {
    test("should create a new product without variants", async () => {
      const newProduct = {
        name: "New Product",
        description: "New Description",
        price: 19.99,
      };

      const response = await request(app)
        .post("/api/v1/products")
        .send(newProduct);

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual("Product Added Succesfully");
    });

    test("should create a new product with variants", async () => {
      const newProduct = {
        name: "New Product",
        description: "New Description",
        price: 19.99,
        varients: [
          {
            name: "small",
            sku: "red-one-to",
            additionalCost: 50,
            stockCount: 50000,
          },
        ],
      };

      const response = await request(app)
        .post("/api/v1/products")
        .send(newProduct);

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual(
        "Added Products with Varients Succesfully"
      );
    });
  });

  describe("PUT /products/:id", () => {
    let product;
    test("should update a product", async () => {
      const newProduct = {
        name: "New Product",
        description: "New Description",
        price: 19.99,
      };

      product = await Product.create(newProduct);

      const updatedProduct = {
        name: "Updated Product",
        description: "Updated Description",
        price: 29.99,
      };

      const response = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .send(updatedProduct);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual("Updated Product");
    });

    test("should return an error message: not correct data", async () => {
      const updatedProduct = {
        name: 626115151,
        description: "Updated Description",
        price: 29.99,
      };

      const response = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .send(updatedProduct);

      expect(response.status).toBe(400);
      expect(response.body.msg).toEqual("Please Enter Correct types of Data");
    });

    test("should return an error message: product not found", async () => {
      const updatedProduct = {
        name: "Updated Product",
        description: "Updated Description",
        price: 29.99,
      };

      await Product.deleteOne({ _id: product._id });

      const response = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .send(updatedProduct);

      expect(response.status).toBe(404);
      expect(response.body.msg).toEqual("Product not found");
    });
  });

  describe("DELETE /products/:id", () => {
        let product;
        test("should delete a product", async () => {
            const newProduct = {
                name: "New Product",
                description: "New Description",
                price: 19.99,
        };

        product = await Product.create(newProduct);

        const response = await request(app).delete(
            `/api/v1/products/${product._id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.msg).toEqual("Successfully Deleted Product");
        });

        test("should return an error message: product not found", async () => {
          const response = await request(app).delete(`/api/v1/products/${product._id}`);
      
          expect(response.status).toBe(404);
          expect(response.body.msg).toEqual("Product not found");
        });
  });

});
