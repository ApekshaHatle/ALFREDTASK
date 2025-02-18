import mongoose  from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
        },
        fullName:{
            type: String,
            required:true,    
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,    //reference to user model
                ref: 'User',
                default: ""       //initially 0 followers
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,    //reference to user model
                ref: 'User',
                default: ""       //initially 0 followers
            },
        ],
        streak: {
            count: { type: Number, default: 0 },
            lastCompletionDate: { type: Date },
            lastCheckDate: { type: Date }
        },

        completedDates: [{ type: Date }],
        
        profileImg:{
            type: String,
            default: "",
        },

        coverImg: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        link: {
            type: String,
            default: "",
        },
        likedPosts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Post',
                default:[],
            },
        ],
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);  //users

export default User;
