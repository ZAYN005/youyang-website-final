import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requirePermission } from "@/lib/admin-auth";


export async function GET(){

try {
await requirePermission("dashboard");
} catch(error) {
return authErrorResponse(error)!;
}

try {


const total =
await prisma.inquiry.count();



const newLeads =
await prisma.inquiry.count({

where:{
status:"New"
}

});



const recent =
await prisma.inquiry.findMany({

take:5,

orderBy:{
createdAt:"desc"
}

});



return NextResponse.json({

total,

newLeads,

recent

});


}
catch(error){

console.error(error);


return NextResponse.json(
{
error:"Failed to load stats"
},
{
status:500
}
);


}


}