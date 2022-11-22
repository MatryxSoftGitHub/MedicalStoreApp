const req = require('express/lib/request');
const Company = require('../models/company');
const Stock = require('../models/stock');
const Customer = require('../models/customer');
const Sales = require('../models/sales');
const User = require('../models/users');
const Invoice = require('../models/invoice')
const axios=require('axios');
const bcrypt = require("bcryptjs");

let userName='';

//******************* User Login *********************/
exports.userLogin = async (req, res) => {
    const { user_name, password } = req.body
    // Check if username and password is provided
    if (!req.body.user_name || !req.body.password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ user_name })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // comparing given password with hashed password
            req.session.user = user_name;
            userName = user_name;
            bcrypt.compare(password, user.password).then(function (result) {
                result
                ? res.redirect('/route/dashboard')
                : res.status(400).json({ message: "Login not succesful" })
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
}


//******************* User Model *********************/

//create and save new user
exports.createUser = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new company
        bcrypt.hash(req.body.password, 10).then(async (hash) => {
            const user=new User({
                name: req.body.name,
                user_name: req.body.user_name,
                email: req.body.email,
                password: hash,
                role: req.body.role,
            });
            const userInserted = await user.save();
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            return res.status(200).render('createNewUser',{user:username_camelcase,title:"MSS - New User"})
        })
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all user/ retrieve and retrun a single user
exports.findUser = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        User.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found company with id%d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving users details."});
        });
    }else{
        User.find()
        .then(userData=>{
            res.send(userData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading users details."})
        });
    }    
}

//Fetching the specified user id's details
exports.editUser = (req, res) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
        res.render("updateUserDetails", {user:username_camelcase,title:"MSS - Update User",updateUser:user});
        console.log(updateUser)
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified user id's details
exports.updateUserDetail = (req, res) => {
    let userId = req.params.id
    userParams = {
        name: req.body.name,
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }  
    User.findByIdAndUpdate(userId, {$set: userParams})
        .then(async user => {
            const users = await User.find()
            jsonStringifyResult = JSON.stringify(users);
            usersData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateUsers',{user:username_camelcase,title:"MSS - Update User",usersDetails:usersData})
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
        });
}

//Updating the specified user id's details
exports.updateUserPassword = async(req, res) => {
    const user = await User.findOne({ user_name : userName })
    bcrypt.compare(req.body.cur_pwd, user.password).then(function (result) {
        if(result==true){
            if(req.body.new_pwd === req.body.confirm_pwd){
                bcrypt.hash(req.body.new_pwd, 10).then(async (newPasswordhash) => {
                    console.log(newPasswordhash)
                    userParams = {
                        password: newPasswordhash,
                    };
                    User.findByIdAndUpdate(user._id, {$set: userParams})
                        .then(user => {
                            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
                            res.render('changePassword',{user:username_camelcase,title:"MSS - Password Change"})
                        })
                        .catch(error => {
                            console.log(`Error updating user password by ID: ${error.message}`);
                        });
                });
            }
        }else{
            res.send("Current password doesnot match.")
        }
    })
}

//delete a user with specified user id in the request
exports.deleteUser = (req,res)=>{
    const id=req.params.id;
    User.findByIdAndDelete(id)
    .then(async data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete user with id %d",id});
        }else{
            const users = await User.find()
            jsonStringifyResult = JSON.stringify(users);
            usersData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            //res.redirect(`/route/companyDetails`);
            res.render('updateUsers',{user:username_camelcase,title:"MSS - Update Users",usersDetails:usersData})
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting user details."});
    });
}



//******************* Company Model *********************/

//create and save new company
exports.createCompany = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new company
        const company=new Company({
            manufacturer_name: req.body.manufacturer_name,
            supplier_name:req.body.supplier_name,
            supplier_address: req.body.supplier_address,
            supplier_contact_person_name: req.body.supplier_contact_person_name,
            supplier_mobile_number: req.body.supplier_mobile_number,
        });
        const companyInserted = await company.save();
        var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
        return res.status(200).render('createNewCompany',{user:username_camelcase,title:"MSS - New Company"})
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all company/ retrieve and retrun a single company
exports.findCompany = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Company.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found company with id%d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving company details."});
        });
    }else{
        Company.find()
        .then(companyData=>{
            res.send(companyData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading company details."})
        });
    }    
}

//Fetching the specified company id's details
exports.editCompany = (req, res) => {
    let userId = req.params.id;
    Company.findById(userId)
      .then(user => {
        var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
        res.render("updateCompanyDetails", {user:username_camelcase,title:"MSS - Update Company",updateCompany:user});
        console.log(updateCompany)
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified company id's details
exports.updateCompanyDetail = (req, res) => {
    let userId = req.params.id,
    userParams = {
        manufacturer_name: req.body.manufacturer_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        mobile_number: req.body.mobile_number
    };
  
    Company.findByIdAndUpdate(userId, {$set: userParams})
        .then(async user => {
            const company = await Company.find()
            jsonStringifyResult = JSON.stringify(company);
            companyData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateCompany',{user:username_camelcase,title:"MSS - Update Company",companyDetails:companyData})
            // var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            // res.render('dashboard',{user:username_camelcase,title:"MSS - dashboard"})
        })
        .catch(error => {
            console.log(`Error updating company by ID: ${error.message}`);
        });
}

//delete a company with specified company id in the request
exports.deleteCompany = (req,res)=>{
    const id=req.params.id;
    Company.findByIdAndDelete(id)
    .then(async data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete company with id %d",id});
        }else{
            // res.redirect(`/route/companyDetails`);
            const company = await Company.find()
            jsonStringifyResult = JSON.stringify(company);
            companyData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateCompany',{user:username_camelcase,title:"MSS - Update Company",companyDetails:companyData})
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting company details."});
    });
}


//******************* Stock Model *********************/

//create and save new stock
exports.createStock = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new stock
        const stock=new Stock({
            item_name:req.body.item_name,
            item_detail:req.body.item_detail,
            hsn_code:req.body.hsn_code,
            manufacturer_name: req.body.manufacturer_name,
            batch_number:req.body.batch_number,
            medicine_type:req.body.medicine_type,
            unit_price:req.body.unit_price,
            quantity:req.body.quantity,            
            supplier_name: req.body.supplier_name,
            location: req.body.location,
            purchase_date: req.body.purchase_date,
            expiry_date: req.body.expiry_date,
            cgst:req.body.cgst,
            sgst:req.body.sgst
        });
        const stockInserted = await stock.save();
        Company.find(function(err,data){
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            return res.status(200).render('createNewStock',{user:username_camelcase,title:"MSS - New Stock",getCompany:data})
        })
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all stock/ retrieve and retrun a single stock
exports.findStock = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Stock.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found stock with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving stock details."});
        });
    }else{
        Stock.find()
        .then(stockData=>{
            res.send(stockData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading stock details."})
        });
    }    
}

//Fetching the specified stock id's details
exports.editStock = (req, res) => {
    let userId = req.params.id;
    Stock.findById(userId,function(err,user){
        Company.find(function(err,data){
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateStockDetails',{user:username_camelcase,title:'MSS- Update Stock',updateStock:user,getCompany:data})
        })
    })
}

//Updating the specified stock id's details
exports.updateStockDetail = async (req, res) => {
    let userId = req.params.id,
    userParams = {
        item_name:req.body.item_name,
            item_detail:req.body.item_detail,
            hsn_code:req.body.hsn_code,
            manufacturer_name: req.body.manufacturer_name,
            batch_number:req.body.batch_number,
            medicine_type:req.body.medicine_type,
            unit_price:req.body.unit_price,
            quantity:req.body.quantity,            
            supplier_name: req.body.supplier_name,
            location: req.body.location,
            purchase_date: req.body.purchase_date,
            expiry_date: req.body.expiry_date,
            cgst:req.body.cgst,
            sgst:req.body.sgst
    };  
    Stock.findByIdAndUpdate(userId, {$set: userParams})
        .then(async user => {
            const stocks = await Stock.find()
            jsonStringifyResult = JSON.stringify(stocks);
            stocksData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateStock',{user:username_camelcase,title:"MSS - Update Stock",stockDetails:stocksData})
        })
        .catch(error => {
            console.log(`Error updating stock by ID: ${error.message}`);
        });
}

//delete a stock with specified stock id in the request
exports.deleteStock = (req,res)=>{
    const id=req.params.id;
    Stock.findByIdAndDelete(id)
    .then(async data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete stock with id %d",id});
        }else{
            // res.redirect(`/route/updateStock`);
            const stocks = await Stock.find()
            jsonStringifyResult = JSON.stringify(stocks);
            stocksData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateStock',{user:username_camelcase,title:"MSS - Update Stock",stockDetails:stocksData})
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting stock details."});
    });
}


//******************* Customer Model *********************/

//create and save new customer
exports.createCustomer = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new customer
        const customer=new Customer({
            customer_name: req.body.customer_name,
            customer_mobile_number: req.body.customer_mobile_number,
            reference_doctor: req.body.reference_doctor,
            customer_type:req.body.customer_type
        });
        const customerInserted = await customer.save();
        var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
        return res.status(200).render('createNewCustomer',{user:username_camelcase,title:"MSS - New Customer"})
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all customer/ retrieve and retrun a single customer
exports.findCustomer = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Customer.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found customer with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving customer details."});
        });
    }else{
        Customer.find()
        .then(customerData=>{
            res.send(customerData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading customer details."})
        });
    }    
}

//Fetching the specified customer id's details
exports.editCustomer = (req, res) => {
    let userId = req.params.id;
    Customer.findById(userId)
      .then(user => {
        var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
        res.render("updateCustomerDetails", {user:username_camelcase,title:"MSS - Update Client",updateCustomer:user});
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified customer id's details
exports.updateCustomerDetail = (req, res) => {
    let userId = req.params.id,
    userParams = {
        customer_name: req.body.customer_name,
        customer_mobile_number: req.body.customer_mobile_number,
        reference_doctor: req.body.reference_doctor,
        customer_type:req.body.customer_type
    };
  
    Customer.findByIdAndUpdate(userId, {$set: userParams})
        .then(async user => {
            const customer = await Customer.find()
            jsonStringifyResult = JSON.stringify(customer);
            customersData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateCustomer',{user:username_camelcase,title:"MSS - Update Customer",customerDetails:customersData})
        })
        .catch(error => {
            console.log(`Error updating customer by ID: ${error.message}`);
        });
}

//delete a customer with specified customer id in the request
exports.deleteCustomer = (req,res)=>{
    const id=req.params.id;
    Customer.findByIdAndDelete(id)
    .then(async data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete customer with id %d",id});
        }else{
            const customer = await Customer.find()
            jsonStringifyResult = JSON.stringify(customer);
            customersData = JSON.parse(jsonStringifyResult);
            var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
            res.render('updateCustomer',{user:username_camelcase,title:"MSS - Update Customer",customerDetails:customersData})
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting customer details."});
    });
}


//******************* Sales Model *********************/

//create and save new sales
exports.createSales = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new sales
        const sell=new Sales({
            src_customer_name: req.body.src_customer_name,
            medicine_name: req.body.medicine_name,
            medicine_quantity: req.body.medicine_quantity,
            medicine_price: req.body.medicine_price,
            sell_quantity: req.body.sell_quantity,   
            total_amount: req.body.total_amount          
        });
        const salesInserted = await sell.save();
        // return res.status(200).render('salesDetails',{user:req.session.user,title:"MSS - Sales Details"})

        axios.get("http://localhost:3000/route/api/medical/sales")
        Stock.find(function(err,medicineData){
            Client.find(function(err,clientData){
                Sales.find(function(err,salesData){
                    res.render('salesDetails',{user:req.session.user, title:'MSS- Sales Details', getMedicine: medicineData, getClient: clientData, getSales:salesData})
                })
            })
        })
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all sales/ retrieve and retrun a single sales
exports.findSales = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Client.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found client with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving client details."});
        });
    }else{
        Client.find()
        .then(salesData=>{
            res.send(salesData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading client details."})
        });
    }    
}

//Fetching the specified sales id's details
exports.editSales = (req, res) => {
    let userId = req.params.id;
    Client.findById(userId)
      .then(user => {
        res.render("updateClientDetails", {user:req.session.user,title:"MSS - Update Client",updateClient:user});
        console.log(updateClient)
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified sales id's details
exports.updateSalesDetail = (req, res) => {
    let userId = req.params.id
    console.log(userId)
    userParams = {
        quantity: (req.body.medicine_quantity)-(req.body.sell_quantity)
    };
  
    Stock.findByIdAndUpdate(userId, {$set: userParams})
        .then(user => {
            res.render('salesDetails',{user:req.session.user,title:"MSS - Sales Details"})
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
        });
}

//delete a sales with specified sales id in the request
exports.deleteSales = (req,res)=>{
    const id=req.params.id;
    Client.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete sales with id %d",id});
        }else{
            res.redirect(`/route/salesDetails`);
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting sales details."});
    });
}

//create and save new invoice
exports.createInvoice = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new customer
        const invoice=new Invoice({
            file_name: req.body.file_name,
            cust_name: req.body.cust_name,
            mob_number: req.body.mob_number,
            ref_doctor: req.body.ref_doctor,
            pdf_content: req.body.pdf_content,
        });
        const invoiceInserted = await invoice.save();
        var username_camelcase=userName.replace(/^./, (userName) => userName.toUpperCase());
        if(req.session){
            Stock.find(function(err,medicineData){
                Customer.find(function(err,customerData){
                    Sales.find(function(err,salesData){
                        res.render('createNewSale',{user:username_camelcase, title:'MSS- Create New Sale', getSales:salesData, getMedicine: medicineData, getCustomer: customerData},(error, html) =>{
                            if(error){ 
                                console.log(error) 
                                next(error)
                                return
                            }
                            res.send(html) 
                        })
                    })                              
                })
            })
        }else{
            res.send('Unauthorized user')
        }
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all Invoice/ retrieve and retrun a single Invoice
exports.findInvoice = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Invoice.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found invoice with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving invoice details."});
        });
    }else{
        Invoice.find()
        .then(invoiceData=>{
            res.send(invoiceData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading invoice details."})
        });
    }    
}