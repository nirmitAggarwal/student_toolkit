const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Student Toolkit API',
  });
};

export default { getHealth };
