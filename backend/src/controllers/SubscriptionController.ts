import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/SubscriptionService.js";
import { getUserId, parseId } from "../helpers/ParamsHelper.js";

export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    listMySubscriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const subscriptions = await this.subscriptionService.listarMisSuscripciones(getUserId(req))
            res.status(200).json(subscriptions)
        } catch (error) {
            next(error)
        }
    }

    subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libroId = parseId(req.body?.libroId, "libroId")
            const subscription = await this.subscriptionService.suscribirse(getUserId(req), libroId)
            res.status(201).json(subscription)
        } catch (error) {
            next(error)
        }
    }

    unsubscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libroId = parseId(req.params.libroId, "libroId")
            await this.subscriptionService.desuscribirse(getUserId(req), libroId)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
