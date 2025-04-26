import express, { NextFunction, Request, Response } from 'express';
import { CarsController } from './cars.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CarsValidations } from './cars.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();
// auth agency
router.post(
    '/',
    fileUploadHandler(), // Middleware for handling file uploads
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if the car image is uploaded
            if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })['carImage']) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'No car image uploaded',
                });
            }

            // @ts-ignore
            const carImage = getSingleFilePath(req.files, 'carImage');

            if (!carImage) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Car image path is not defined',
                });
            }

            // Map the car data with the correct fields
            req.body = {
                ...req.body,
                carImage,
                carSeatsNumber: Number(req.body.carSeatsNumber),
                price: Number(req.body.price),
                ProtectionPlan: Array.isArray(req.body.protectionPlan)
                    ? req.body.protectionPlan
                    : JSON.parse(req.body.protectionPlan || '[]'),
            };

            // Proceed to the next middleware or controller
            next();
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: 'Error while uploading car image',
            });
        }
    },
    auth(USER_ROLES.AGENCY),  // Protect route with the authorization middleware
    CarsController.createCar  // Controller function to create the car
);

// get all cars by agency id
router.get('/agency', auth(USER_ROLES.AGENCY), CarsController.getAllCarsByAgencyId);
// get all
router.get('/', CarsController.getAllCars);
// get single one
router.get('/:id', CarsController.getSingleCar);
// update one
router.patch(
    '/:id',
    fileUploadHandler(), // Middleware to handle the file upload
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['carImage']) {
                // @ts-ignore
                const carImage = getSingleFilePath(req.files, 'carImage');

                if (!carImage) {
                    return sendResponse(res, {
                        statusCode: 400,
                        success: false,
                        message: "Car image path is not defined",
                    });
                }

                // Add the new car image to the request body
                req.body.carImage = carImage;
            }
            if (req.body.protectionPlan) {
                req.body.ProtectionPlan = Array.isArray(req.body.protectionPlan)
                    ? req.body.protectionPlan
                    : JSON.parse(req.body.protectionPlan || '[]');
            }

            next();
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: 'Error while uploading car image',
            });
        }
    },
    CarsController.updateCar
);


// delete one
router.delete('/:id', CarsController.deleteCar);



export const CarsRoutes = router;
