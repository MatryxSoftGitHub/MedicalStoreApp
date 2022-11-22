const e=require('express');
var express=require('express');
var router=express.Router();
const Stock=require('../models/stock');
const Company=require('../models/company');
const Customer=require('../models/customer');
const Sales =require('../models/sales');
const Users =require('../models/users');
const axios=require('axios');
const controller=require('../controller/controller');
let user=''

//********************  Login API  *******************/
router.post('/api/medical/auth/login',controller.userLogin); //User login

//********************  Home page  *******************/

//route for dashboard
router.get('/dashboard',(req,res)=>{
    session=req.session;
    user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        res.render('dashboard',{user:username_camelcase,title:"MSS - Dashboard"})
    }else{
        res.send('Unauthorized user')
    }
});

//********************  Logout  *******************/

//route for logout
router.get('/logout',(req,res)=>{
    req.session.destroy(function(err){  
        if(err){  
            res.send(err);  
        }  
        else  
        {  
            res.clearCookie('sessionCookie');
            res.redirect('/');  
        }  
    });  
});

//********************  User Model *******************/

//API's for User model
router.post('/api/medical/users',controller.createUser); //Create a new user
router.get('/api/medical/users',controller.findUser); //Get all user details or single 
router.put('/api/medical/users/:id/update',controller.updateUserDetail); //Update a user details
router.delete('/api/medical/users/:id',controller.deleteUser); //Delete a user details
router.get("/api/medical/users/:id/edit", controller.editUser); //Get current user id and details
router.put('/api/medical/users',controller.updateUserPassword); //Update user password


//Navigate to Create new user page
router.get('/createNewUser',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        res.render('createNewUser',{user:username_camelcase,title:"MSS - New User"})
    }else{
        console.log('Failed to navigate user create page.');
        //res.redirect('createNewCompany',{user:req.session.user,title:"MSS - New Company"})
    }
});

//Navigate to Create new user page
router.get('/changePassword',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        res.render('changePassword',{user:username_camelcase,title:"MSS - Password Change"})
    }else{
        console.log('Failed to navigate password change page.');
        //res.redirect('createNewCompany',{user:req.session.user,title:"MSS - New Company"})
    }
});

//Navigate to User Details page and displaying all User details
router.get('/userDetails',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/users")
        .then(function(usersDetailsData){
            res.render('userDetails',{user:username_camelcase,title:"MSS - User Details",usersDetails:usersDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the user list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to Update User Details page and displaying all User details
router.get('/updateUsers',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/users")
        .then(function(usersDetailsData){
            res.render('updateUsers',{user:username_camelcase,title:"MSS - User Details",usersDetails:usersDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the user list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//********************  Company Model *******************/

//API's for company model
router.post('/api/medical/companies',controller.createCompany); //Create a new company
router.get('/api/medical/companies',controller.findCompany); //Get all company details or single 
router.put('/api/medical/companies/:id/update',controller.updateCompanyDetail); //Update a company details
router.delete('/api/medical/companies/:id',controller.deleteCompany); //Delete a company details
router.get("/api/medical/companies/:id/edit", controller.editCompany); //Get current company id and details
//router.put("/api/medical/companies/:id/update", controller.update);

//Navigate to Create new company page
router.get('/createNewCompany',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        res.render('createNewCompany',{user:username_camelcase,title:"MSS - New Company"})
    }else{
        console.log('Failed to create company details:');
        //res.redirect('createNewCompany',{user:req.session.user,title:"MSS - New Company"})
    }
});

//Navigate to Company details page and displaying all company details
router.get('/companyDetails',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/companies")
        .then(function(companyDetailsData){
            res.render('companyDetails',{user:username_camelcase,title:"MSS - Company Details",companyDetails:companyDetailsData.data})
        })
        .catch(err=>{
            console.log('Failed to retrieve the companies list: ' + err);
            
        })        
    }else{
        res.send('Unauthorized user')
        //res.redirect('companyDetails',{user:req.session.user,title:"MSS - Company Details",companyDetails:companyDetailsData.data})
    }
});

//Navigate to Company details page and displaying all company details
router.get('/updateCompany',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/companies")
        .then(function(companyDetailsData){
            res.render('updateCompany',{user:username_camelcase,title:"MSS - Company Update",companyDetails:companyDetailsData.data})
        })
        .catch(err=>{
            console.log('Failed to retrieve the companies list: ' + err);
            
        })        
    }else{
        res.send('Unauthorized user')
        //res.redirect('companyDetails',{user:req.session.user,title:"MSS - Company Details",companyDetails:companyDetailsData.data})
    }
});

//********************  Stock Model *******************/

//API's for stock model
router.post('/api/medical/stocks',controller.createStock); //Create a new stock
router.get('/api/medical/stocks',controller.findStock); //Get all stock details or single 
router.put('/api/medical/stocks/:id/update',controller.updateStockDetail); //Update a stock details
router.delete('/api/medical/stocks/:id',controller.deleteStock); //Delete a stock details
router.get("/api/medical/stocks/:id/edit", controller.editStock); //Get current stock id and details
//router.put("/api/medical/stocks/:id/update", controller.update);

//Add new stock
router.get('/createNewStock',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        Company.find((err, data) => {
            if (!err) {
                res.render('createNewStock', {user:username_camelcase, title:"MSS - New Stock", getCompany: data});
            } else {
                console.log('Failed to create stock details: ' + err);
            }
        });        
    }else{
        res.send('Unauthorized user')
    }
});

//********************  User Role Fetch Function  *******************/
async function userRole(user_name) {
    (async () => {
        var user = await Users.findOne({ user_name });
        jsonStringifyResult = JSON.stringify(user);
        userDetails = JSON.parse(jsonStringifyResult);
        return userDetails.role;
    })();
}

//Navigate to Update Stock page and displaying all Stock details
router.get('/updateStock',async (req,res)=>{ 
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    await userRole(user);
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/stocks")
        .then(function(stockDetailsData){
            if(userDetails.role.toUpperCase()==='ADMIN'){
                res.render('updateStock',{user:username_camelcase,title:"MSS - Update Stock",stockDetails:stockDetailsData.data})
            }     
            else{
                res.send("User not authorized to update stock");
            }       
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the stocks list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to Stock Details page and displaying all Stock details
router.get('/stockDetails',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/stocks")
        .then(function(stockDetailsData){
            res.render('stockDetails',{user:username_camelcase,title:"MSS - Stock Details",stockDetails:stockDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the stocks list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//********************  Customer Model *******************/

//API's for customer model
router.post('/api/medical/customers',controller.createCustomer); //Create a new customer
router.get('/api/medical/customers',controller.findCustomer); //Get all stock customer or single 
router.put('/api/medical/customers/:id/update',controller.updateCustomerDetail); //Update a customer details
router.delete('/api/medical/customers/:id',controller.deleteCustomer); //Delete a customer details
router.get("/api/medical/customers/:id/edit", controller.editCustomer); //Get current customer id and details
//router.put("/api/medical/customers/:id/update", controller.update);

//Add new customer
router.get('/createNewCustomer',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        res.render('createNewCustomer', {user:username_camelcase, title:"MSS - New Customer"});        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to customers Details page and displaying all customers details
router.get('/updateCustomer',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/customers")
        .then(function(customerDetailsData){
            res.render('updateCustomer',{user:username_camelcase,title:"MSS - Update Customer",customerDetails:customerDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the customers list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to customers details page and displaying all customers details
router.get('/existingCustomerDetails',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/customers")
        .then(function(customerDetailsData){
            res.render('existingCustomerDetails',{user:username_camelcase,title:"MSS - Customer Details",customerDetails:customerDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the customers list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to existing customers details page and displaying all customers details
router.get('/customerDetails',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/customers")
        .then(function(customerDetailsData){
            res.render('customerDetails',{user:username_camelcase,title:"MSS - Customer Details",customerDetails:customerDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the customers list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});


//******************** Sales Invoice Model *******************/

//API's for invoice model
router.post('/api/medical/invoices',controller.createInvoice); //Create a new invoice
router.get('/api/medical/invoices',controller.findInvoice); //Get all Invoice or single 

//Add new sell
router.get('/createNewSale',(req,res,next)=>{    
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
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
});

//Navigate to existing customers details page and displaying all customers details
router.get('/salesInvoiceDetails',(req,res)=>{
    // session=req.session;
    // var user=session.user
    var username_camelcase=user.replace(/^./, (user) => user.toUpperCase());
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/invoices")
        .then(function(invoiceDetailsData){
            res.render('salesInvoiceDetails',{user:username_camelcase,title:"MSS - Sales Invoice Details",salesInvoiceDetails:invoiceDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the invoice list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

module.exports = router;