// import { Page } from "../models/Page.js";
// const PermissionOnSignup=async()=>{
//     try {
//         const pagesData=await Page.find().select("-category ")
//         if (!pagesData || pagesData.length === 0) {
//             console.error("No pages found for permissions.");
//             return;
//         }
//         const permissionsTemplate=pagesData.map((page)=>({
//             page:page.name,
//             features:page.features.map((feature)=>(
//                 feature.name
//             ))
//         }))
//         return permissionsTemplate
//     } catch (error) {
//         console.error("Error fetching pages:", error);
//     }
// }

// export default PermissionOnSignup