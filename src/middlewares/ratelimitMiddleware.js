import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5, 
    message: "Too many orders from this IP, please try again after 15 minutes",
    legacyHeaders: true,
})