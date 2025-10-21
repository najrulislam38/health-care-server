import { stripe } from "../../helpers/stripe";
import { prisma } from "../../shared/prisma";
import { IJwtUserPayload } from "../../types/common";
import { v4 as uuidv4 } from "uuid";

const createAppointmentFromDB = async (
  user: IJwtUserPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  }); // like boolean

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await prisma.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload?.scheduleId,
        videoCallingId,
      },
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientData.email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Appointment with Dr. ${doctorData.name}`,
              // description: `Date: ${appointmentDate}`,
            },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },
      // success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `https://web.programming-hero.com/home`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      // metadata: { doctorId, appointmentDate },
    });

    console.log(session);

    return { paymentUrl: session.url };
  });

  return result;
};

export const AppointmentService = {
  createAppointmentFromDB,
};
