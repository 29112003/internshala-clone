const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeModel = new mongoose.Schema(
    {
        firstname:{
            type:String,
            required:[true, "First Name is required"],
            minLength:[4,"First name should be atleast 4 character long"],
        },
        lastname:{
            type:String,
            required:[true, "last Name is required"],
            minLength:[4,"last name should be atleast 4 character long"],
        },
        contact:{
            type:String,
            required:[true, "contact is required"],
            maxLenght:[10, "contact must not exceed 10 character"],
            minLength:[10,"contact should be atleast 10 character long"],
        },
        
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // Ensures the email is unique in the collection
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                'Please provide a valid email address'
            ], // Improved email validation regex
            lowercase: true, // Converts email to lowercase before saving
            trim: true // Trims any leading or trailing spaces
        },
        password : {
            type:String,
            select:false,
            maxLength : [15 , "Password should not exceed more than 15 characters"],
            minLength : [6 , "Password should have atleast 6 characters"],
            // match
        },
        resetPasswordToken: {
            type:String,
            default:"0",
        },
        organizationname:{
            type:String,
            required:[true, "Organization Name is required"],
            minLength:[4,"Organization name should be atleast 4 character long"],
        },
        organizationlogo:{
            type:Object,
            default:{
                fileId:"",
                url:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            }
        },
        internships: [
            {
                type : mongoose.Schema.Types.ObjectId, ref : "internship",
            }
        ],
        jobs:[
            {
                type : mongoose.Schema.Types.ObjectId, ref : "job",
            }
        ]
        
    }, 
    {timestamps : true}
)


employeModel.pre("save", function(){

    if(!this.isModified("password")){
        return;
    }

    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

employeModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

// to create login we need to create token
employeModel.methods.getjwttoken = function(){
    return jwt.sign({ id : this._id} , process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE,
    })
}

const Employe = mongoose.model("Employe", employeModel);

module.exports = Employe;