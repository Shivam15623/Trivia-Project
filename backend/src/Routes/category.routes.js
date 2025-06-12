import { Router } from "express";
import passport from "passport";
import {
  CategoriesFetch,
  createCategory,
  DashboardCategory,
  fetchCategoryDetails,
  getAllCategories,
  getAllCategoriesPublic,
  PublicToggle,
  updateCategory,
} from "../controller/category.controller.js";
import { upload } from "../middleware/multer.js";
import { validateRequest } from "../middleware/validate.js";
import { categorySchema } from "../validations/CategorySchema.js";
const router = Router();

router
  .route("/createCategory")
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.single("thumbnail"),
    validateRequest(categorySchema),
    createCategory
  );
router
  .route("/FetchCategories")
  .get(passport.authenticate("jwt", { session: false }), getAllCategories);

router
  .route("/fetchCategoryDetails/:slug")
  .get(passport.authenticate("jwt", { session: false }), fetchCategoryDetails);
router.route("/fetchCategoriesHome").get(CategoriesFetch);
router
  .route("/FetchPublisCategories")
  .get(
    passport.authenticate("jwt", { session: false }),
    getAllCategoriesPublic
  );
router
  .route("/updateCategory/:categoryId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    upload.single("thumbnail"),
    validateRequest(categorySchema),
    updateCategory
  );
router
  .route("/publicToggle/:categoryId")
  .patch(passport.authenticate("jwt", { session: false }), PublicToggle);
router.route("/dashboardCategories").get(DashboardCategory);
export default router;
