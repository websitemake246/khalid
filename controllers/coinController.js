const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// Add Coins
exports.earnCoins = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.coin_balance += amount;
    await user.save();

    await Transaction.create({
      user_id: userId,
      type: 'earn',
      amount,
      description: 'Earned coins',
    });

    res.status(200).send({ message: 'Coins added!', coin_balance: user.coin_balance });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Spend Coins
exports.spendCoins = async (req, res) => {
  const { userId, amount, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    if (user.coin_balance < amount) {
      return res.status(400).send('Insufficient coins');
    }

    user.coin_balance -= amount;
    await user.save();

    await Transaction.create({
      user_id: userId,
      type: 'spend',
      amount: -amount,
      description,
    });

    res.status(200).send({ message: 'Coins spent!', coin_balance: user.coin_balance });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
