const request = require("supertest");
const app = require("../server");

const Product = require("../models/ProductSchema");
const Varient = require("../models/VarientSchema");

describe("VariantController API Endpoints", () => {
  let product;
  let varient;

  describe("POST /varients", () => {
    test("should create a new variant", async () => {
      product = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
      });

      const response = await request(app)
        .post(`/api/v1/varients/${product._id}`)
        .send({
          name: "new",
          sku: "NewONe",
          additionalCost: 40,
          stockCount: 10000,
        });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe("Varient Created Succesfully");
    });

    test("should return a error message: Enter Correct types", async () => {
      product = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
      });

      const response = await request(app)
        .post(`/api/v1/varients/${product._id}`)
        .send({
          name: "new",
          sku: "NewONe",
          additionalCost: 40,
          stockCount: "10000",
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Please Enter Correct types of Data");
    });
  });

  describe("GET /varients", () => {
    test("should get all varients", async () => {
      const response = await request(app).get("/api/v1/varients");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should get a single Product's Varients", async () => {
      const response = await request(app).get(
        `/api/v1/varients?productId=${product._id}`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should get a single variant", async () => {
      varient = await Varient.create({
        name: "new",
        sku: "NewONe",
        additionalCost: 40,
        stockCount: 10000,
        productId: product._id,
      });

      const response = await request(app).get(
        `/api/v1/varients/${varient._id}`
      );
      expect(response.status).toBe(200);
      expect(JSON.stringify(response.body._id)).toEqual(
        JSON.stringify(varient._id)
      );
    });

    test("should get an error: Product not found", async () => {
      await Product.deleteOne({ _id: product._id });

      const response = await request(app).get(
        `/api/v1/varients?productId=${product._id}`
      );

      expect(response.status).toBe(404);
      expect(response.body.msg).toEqual("No Product found");
    });
  });

  describe("PUT /varients", () => {
    test("should update the varient", async () => {
      varient = await Varient.create({
        name: "biggie",
        sku: "blue-one",
        additionalCost: 200,
        stockCount: 300,
        productId: product._id,
      });

      const response = await request(app)
        .get(`/api/v1/varients/${varient._id}`)
        .send({
          name: "smallie",
          sku: "white-one",
          additionalCost: 10,
          stockCount: 500,
        });

      expect(response.status).toBe(200);
    });

    test("should return error msg: Enter correct Data", async () => {
      const response = await request(app)
        .put(`/api/v1/varients/${varient._id}`)
        .send({
          name: 5151,
          sku: "white-one",
          additionalCost: 10,
          stockCount: 500,
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toEqual("Please Enter Correct types of Data");
    });
  });

  describe("DELETE /varients", () => {
    test("should get the varient deleted", async () => {
        const response = await request(app).delete(`/api/v1/varients/${varient._id}`);
  
        expect(response.status).toBe(200);
        expect(response.body.msg).toEqual("Document Deleted Succesfully");
      });


    test("should return an error message", async () => {
      const response = await request(app).delete(`/api/v1/varients/${varient._id}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toEqual("Varient Not Found");
    });

  });

});

