import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-auth";


export const dynamic = "force-dynamic";



export async function GET(){


try{


await requirePermission("analytics");



const inquiries = await prisma.inquiry.findMany({

orderBy:{
createdAt:"desc"
}

});





const total = inquiries.length;



const status = {


New:

inquiries.filter(
(i:any)=>i.status==="New"
).length,



Reviewing:

inquiries.filter(
(i:any)=>i.status==="Reviewing"
).length,



Contacted:

inquiries.filter(
(i:any)=>i.status==="Contacted"
).length,



Qualified:

inquiries.filter(
(i:any)=>i.status==="Qualified"
).length,



Closed:

inquiries.filter(
(i:any)=>i.status==="Closed"
).length,


};





const products:any = {};



inquiries.forEach(
(item:any)=>{


const product =
item.productInterest || "Unknown";


if(!products[product]){

products[product]=0;

}


products[product]++;


});





const countries:any = {};



inquiries.forEach(
(item:any)=>{


const country =
item.country || "Unknown";


if(!countries[country]){

countries[country]=0;

}


countries[country]++;


});





return NextResponse.json({

total,

status,

products,

countries,

recent:

inquiries.slice(0,10)

});


}



catch(error:any){


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



if(error.message==="FORBIDDEN"){

return NextResponse.json(
{
error:"Forbidden"
},
{
status:403
}
);

}



return NextResponse.json(
{
error:"Server error"
},
{
status:500
}
);


}



}