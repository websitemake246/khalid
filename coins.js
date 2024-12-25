// Add coins to the user's balance
app.post('/earn-coins', async (req, res) => {
  const { userId, amount } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found");

  user.coin_balance += amount;
  await user.save();

  await Transaction.create({
    user_id: userId,
    type: 'earn',
    amount: amount,
    description: 'Daily free coins',
  });

  res.send({ message: 'Coins added!', coin_balance: user.coin_balance });
});
