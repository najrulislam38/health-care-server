import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;

      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      // console.log("payment successful");
      // console.log({ appointmentId });
      // console.log({ paymentId });

      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          paymentStatus:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
        },
      });

      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          paymentGateway: session,
        },
      });

      //   await prisma.appointment.update({
      //     where: {
      //       id: appointmentId,
      //     },
      //     data: {
      //       paymentStatus:
      //         session.payment_status === "paid"
      //           ? PaymentStatus.PAID
      //           : PaymentStatus.UNPAID,
      //     },
      //   });

      //   await prisma.payment.update({
      //     where: {
      //       id: paymentId,
      //     },
      //     data: {
      //       status:
      //         session.payment_status === "paid"
      //           ? PaymentStatus.PAID
      //           : PaymentStatus.UNPAID,
      //       paymentGatewayData: session,
      //     },
      //   });

      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
