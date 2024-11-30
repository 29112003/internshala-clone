exports.sendToken = (student, statusCode, res) => {
  const token = student.generateAuthToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // Uncomment in production
    // secure:true
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, id: student._id , token });

};
