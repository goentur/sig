import { Checkbox } from "@/Components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu";
import { alertApp } from "@/utils";
import axios from "axios";
import { BadgeX, DatabaseBackup, Ellipsis, Loader2, Pencil } from 'lucide-react';
import { useEffect, useState } from "react";

type DataTableProps = {
  gate:{
    create : boolean,
    update : boolean,
    delete : boolean,
  };
  loading: boolean;
  dataTable: [];
  dataInfo: number;
  setForm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setHapus: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DataTable({gate,loading,dataTable,dataInfo,setForm,setIsEdit,setData,setHapus} : DataTableProps) {
    const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        const initialState = dataTable.reduce((acc, value:any) => {
            acc[value.id] = value.status;
            return acc;
        }, {} as Record<string, boolean>);
        
        setCheckboxStates(initialState);
    }, [dataTable]);

    const handleCheckboxChange = (id: string) => {
        setCheckboxStates((prevState) => {
            const newState = !prevState[id];
            updateStatus(id, newState);
            return { ...prevState, [id]: newState };
        });
    };

    const updateStatus = async (id: string, newStatus: boolean) => {
        try {
            const respons =  await axios.post(route('master.pegawai.status'), { id, status: newStatus });
            alertApp(respons.data);
        } catch (error:any) {
            alertApp(error.message, 'error');
        }
    };
    return (
        <div>
            <table className="w-full text-left border-collapse border">
                <thead>
                    <tr className="uppercase text-sm leading-normal">
                        <th className="p-2 border w-1">NO</th>
                        <th className="p-2 border">Jabatan</th>
                        <th className="p-2 border w-1">NIK</th>
                        <th className="p-2 border w-1">NIP</th>
                        <th className="p-2 border">Nama</th>
                        <th className="p-2 border">No Rekening</th>
                        <th className="p-2 border w-1">Status</th>
                        <th className="p-2 border w-1">Aksi</th>
                    </tr>
                </thead>
                <tbody className="font-light">
                    {loading?(
                        <tr>
                            <td colSpan={7}>
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin me-2" size={18} />Mohon Tunggu...
                                </div>
                            </td>
                        </tr>
                    ):
                    dataTable.length > 0 ? dataTable.map((value : any,index:number) => (
                    <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-900">
                        <td className="px-2 py-1 border text-center">{dataInfo++}</td>
                        <td className="px-2 py-1 border">{value.jabatan?.nama}</td>
                        <td className="px-2 py-1 border">{value.nik}</td>
                        <td className="px-2 py-1 border">{value.nip}</td>
                        <td className="px-2 py-1 border">{value.nama}</td>
                        <td className="px-2 py-1 border">{value.no_rekening}</td>
                        <td className="px-2 py-1 border text-center">
                            <Checkbox
                                id={`checkbox-${value.id}`}
                                checked={checkboxStates[value.id]}
                                onCheckedChange={() => handleCheckboxChange(value.id)}
                            />
                        </td>
                        <td className="border text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger className='px-2 py-1'><Ellipsis/></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {gate.update && <DropdownMenuItem onClick={() => {setForm(true), setIsEdit(true), setData({ id:value.id, jabatan:value.jabatan.id,nik:value.nik,nip:value.nip,nama:value.nama, no_rekening:value.no_rekening})}}><Pencil/> Ubah</DropdownMenuItem>}
                                    {gate.delete && <DropdownMenuItem onClick={() => {setHapus(true), setData({id:value.id,})}}><BadgeX/> Hapus</DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                    </tr>
                    )):
                        <tr>
                            <td colSpan={7}>
                                <div className="flex items-center justify-center">
                                    <DatabaseBackup size={18} className='me-2'/> Data tidak ditemukan
                                </div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
