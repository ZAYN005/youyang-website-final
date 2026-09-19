import AuthProvider from "@/components/providers/SessionProvider";
import AdminIntlProvider from "@/components/providers/AdminIntlProvider";


export default function AdminLayout({
children
}:{
children:React.ReactNode
}){


return (

<AuthProvider>

<AdminIntlProvider>

{children}

</AdminIntlProvider>

</AuthProvider>

);

}