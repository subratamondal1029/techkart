/**
 * @swagger
 * tags:
 *   - name: Test
 *     description: Test-related APIs
 *   - name: Users
 *     description: User-related APIs
 *   - name: Products
 *     description: Product-related APIs
 */

/**
 * @swagger
 * /api/v1/test/success:
 *   get:
 *     tags: [Test]
 *     summary: Get test data
 *     description: Fetch test route data
 *     responses:
 *       200:
 *         $ref: "#/components/responses/Success"
 */

/**
 * @swagger
 * /api/v1/test/error:
 *   get:
 *     tags: [Test]
 *     summary: Get error response
 *     description: Fetch error response
 *     responses:
 *       400:
 *         $ref: "#/components/responses/Error"
 */
