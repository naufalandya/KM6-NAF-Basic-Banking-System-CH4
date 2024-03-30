const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

const { v4: uuidv4 } = require('uuid');

const userModel = {
    async getAll(req, res, next) {
        try {

            const users = await prisma.users.findMany();
    
            res.status(200).json({
                status: true,
                message: 'OK',
                data: users
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const id = req.params.id;
            const user = await prisma.users.findUnique({
                where: {
                    id: id
                }
            });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Can\'t find user with id ' + id,
                    data: null
                });
            }
            res.status(200).json({
                status: true,
                message: 'OK',
                data: user
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async create(req, res, next) {
        try {

            const allowedFields = ['username', 'email', 'password'];
            const inputData = req.body;

            for (const key in inputData) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({
                        status: false,
                        message: `Invalid field: ${key}`,
                        data: null
                    });
                }
            }

            if (!req.body.email) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is required!',
                    data: null
                });
            }
    
            if (!req.body.username) {
                return res.status(400).json({
                    status: false,
                    message: 'Username is required!',
                    data: null
                });
            }

            if (!req.body.password) {
                return res.status(400).json({
                    status: false,
                    message: 'Password is required!',
                    data: null
                });
            }
    
            const uuid = uuidv4();
    
            const createUser = await prisma.users.create({
                data: {
                    id: uuid,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                }
            });
    
            res.status(201).json({
                status: true,
                message: 'User created successfully',
                data: createUser
            });
    
        } catch (error) {
            if (error.code === 'P2002') {
                if (error.meta?.target?.includes('username')) {
                    const duplicateUsername = new Error("Username Already Exists");
                    duplicateUsername.status = false;
                    duplicateUsername.statusCode = "P2002";

                    return res.status(400).json({
                        status: false,
                        message: 'Invalid !',
                        error: duplicateUsername.message
                    });

                } else if (error.meta?.target?.includes('email')) {
                    const duplicateEmail = new Error("Email Already Exists");
                    duplicateEmail.status = false;
                    duplicateEmail.statusCode = "P2002";

                    return res.status(400).json({
                        status: false,
                        message: 'Invalid !',
                        error: duplicateEmail.message
                    });

                }
            }
            return next(error);
        }
    }
}


const accountModel = {
    async getAll(req, res, next) {
        try {

            let accounts = await prisma.accounts.findMany();

  
            accounts = accounts.map(account => ({
                id : account.id,
                bank_name: account.bank_name,
                bank_account_number: account.bank_account_number,
                balance: account.balance.toString(),
                userID : account.userID
            }));


            res.status(200).json({
                status: true,
                message: 'OK',
                data: accounts
            });
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const id = req.params.id;

            let account = await prisma.accounts.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!account) {
                return res.status(400).json({
                    status: false,
                    message: 'Can\'t find account with id ' + id,
                    data: null
                });
            }

            account.balance = account.balance.toString();

            res.status(200).json({
                status: true,
                message: 'OK',
                data: account
            });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const allowedFields = ['bank_name', 'bank_account_number', 'balance', 'userID'];

            const inputData = req.body;
    
            for (const key in inputData) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({
                        status: false,
                        message: `Invalid field: ${key}`,
                        data: null
                    });
                }
            }
    
            if (!req.body.bank_name) {
                return res.status(400).json({
                    status: false,
                    message: 'Bank name is required!',
                    data: null
                });
            }
    
            if (!req.body.bank_account_number) {
                return res.status(400).json({
                    status: false,
                    message: 'Bank account number is required!',
                    data: null
                });
            }
    
            if (!req.body.balance) {
                return res.status(400).json({
                    status: false,
                    message: 'Balance is required!',
                    data: null
                });
            }
    
            if (!req.body.userID) {
                return res.status(400).json({
                    status: false,
                    message: 'User ID is required!',
                    data: null
                });
            }
    
            const createdAccount = await prisma.accounts.create({
                data: {
                    bank_name: req.body.bank_name,
                    bank_account_number: req.body.bank_account_number,
                    balance: req.body.balance,
                    userID: req.body.userID
                }
            });

            createdAccount.balance = createdAccount.balance.toString()
    
            res.status(201).json({
                status: true,
                message: 'Account created successfully',
                data: createdAccount
            });
    
        } catch (error) {
            if (error.code === 'P2002') {
    
                if (error.meta?.target?.includes('bank_account_number')) {
                    const duplicateAccountNumber = new Error("Bank account number already exists");
                    duplicateAccountNumber.status = false;
                    duplicateAccountNumber.statusCode = "P2002";
    
                    return res.status(400).json({
                        status: false,
                        message: 'Invalid!',
                        error: duplicateAccountNumber.message
                    });
    
                }
            }
            return next(error);
        }
    }
}



const transactionModel = {
    async getAll(req, res, next) {
        try {

            let transactions = await prisma.transactions.findMany();

  
            transactions = transactions.map(transaction => ({
                id : transaction.id,
                source_account_id: transaction.source_account_id,
                destination_account_id : transaction.destination_account_id,
                amount : transaction.amount
            }));


            res.status(200).json({
                status: true,
                message: 'OK',
                data: transactions
            });
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const id = req.params.id;

            let transaction = await prisma.transactions.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!transaction) {
                return res.status(400).json({
                    status: false,
                    message: 'Can\'t find transaction with id ' + id,
                    data: null
                });
            }

            transaction.amount = transaction.amount.toString();

            res.status(200).json({
                status: true,
                message: 'OK',
                data: transaction
            });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const allowedFields = ['source_account_id', 'destination_account_id', 'amount'];
            const inputData = req.body;
    
            for (const key in inputData) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({
                        status: false,
                        message: `Invalid field: ${key}`,
                        data: null
                    });
                }
            }
    
            if (req.body.source_account_id === req.body.destination_account_id) {
                return res.status(400).json({
                    status: false,
                    message: 'Source account and destination account is same',
                    data: null
                });
            }
    
            const createdTransaction = await prisma.transactions.create({
                data: {
                    source_account_id: req.body.source_account_id,
                    destination_account_id: req.body.destination_account_id,
                    amount: req.body.amount
                }
            });
    
            res.status(201).json({
                status: true,
                message: 'Transaction created successfully',
                data: createdTransaction
            });
    
        } catch (error) {
            return next(error);
        }
    }
    
}

module.exports = {userModel, accountModel, transactionModel};