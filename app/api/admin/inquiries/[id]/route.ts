import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requirePermission } from "@/lib/admin-auth";



export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {


  try {
    await requirePermission("inquiries");
  } catch (error) {
    return authErrorResponse(error)!;
  }


  const { id } = await context.params;


  const body = await request.json();



  try {


    const updated = await prisma.inquiry.update({

      where: {
        id,
      },


      data: {

        status: body.status,

        priority: body.priority,

        adminNote: body.adminNote,

        assignedTo: body.assignedTo,

      },

    });



    return NextResponse.json(updated);



  } catch(error) {


    console.error(error);


    return NextResponse.json(

      {
        error:"Update failed"
      },

      {
        status:500
      }

    );


  }

}






export async function DELETE(

  request: Request,

  context: {
    params: Promise<{
      id:string;
    }>;
  }

) {


  try {
    await requirePermission("inquiries");
  } catch (error) {
    return authErrorResponse(error)!;
  }


  const { id } = await context.params;



  try {


    await prisma.inquiry.delete({

      where:{
        id,
      }

    });



    return NextResponse.json({

      success:true

    });



  } catch(error) {


    console.error(error);


    return NextResponse.json(

      {
        error:"Delete failed"
      },

      {
        status:500
      }

    );


  }


}