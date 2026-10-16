import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { authErrorResponse, requirePermission } from "@/lib/admin-auth";


export const dynamic = "force-dynamic";



export async function GET(){


try{


await requirePermission("inquiries");



const inquiries = await prisma.inquiry.findMany({

orderBy:{
createdAt:"desc"
}

});





const stats = {


total:

inquiries.length,



new:

inquiries.filter(
(i:any)=>i.status==="New"
).length,



contacted:

inquiries.filter(
(i:any)=>i.status==="Contacted"
).length,



qualified:

inquiries.filter(
(i:any)=>i.status==="Qualified"
).length,



closed:

inquiries.filter(
(i:any)=>i.status==="Closed"
).length,


};





return NextResponse.json({

stats,

inquiries

});


}



catch(error:any){

const authError = authErrorResponse(error);
if(authError) return authError;


if(error.message==="UNAUTHORIZED"){

return NextResponse.json(
{
error:"Unauthorized"
},
{
status:401
}
);

}



return NextResponse.json(
{
error:"Failed"
},
{
status:500
}
);


}



}