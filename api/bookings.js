let bookings = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ bookings });
  }

  if (req.method === "POST") {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required.",
      });
    }

    const alreadyBooked = bookings.some(
      (booking) => booking.date === date && booking.time === time
    );

    if (alreadyBooked) {
      return res.status(409).json({
        success: false,
        message: "This time slot has already been booked.",
      });
    }

    bookings.push({ date, time });

    return res.status(200).json({
      success: true,
      message: "Booking saved successfully.",
    });
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed.",
  });
}
