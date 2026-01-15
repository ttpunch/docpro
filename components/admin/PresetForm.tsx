'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { PhotoSpec } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    display_name: z.string().min(2, "Name must be at least 2 characters."),
    code: z.string().min(2).regex(/^[a-z0-9-]+$/, "Code must be lowercase, numbers, and hyphens only"),
    width_px: z.number().min(50),
    height_px: z.number().min(50),
    aspect_ratio: z.number().min(0.1),
    file_size_min_kb: z.number().min(0),
    file_size_max_kb: z.number().min(1),
    background_color: z.string(),
    face_coverage_min: z.number().min(0).max(1),
    face_coverage_max: z.number().min(0).max(1),
    description: z.string(),
    source_url: z.string(),
    is_active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export function PresetForm({ initialData }: { initialData?: PhotoSpec }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            display_name: initialData?.display_name ?? "",
            code: initialData?.code ?? "",
            width_px: initialData?.width_px ?? 350,
            height_px: initialData?.height_px ?? 450,
            aspect_ratio: initialData?.aspect_ratio ?? 0.77,
            file_size_min_kb: initialData?.file_size_min_kb ?? 20,
            file_size_max_kb: initialData?.file_size_max_kb ?? 50,
            background_color: initialData?.background_color ?? "white",
            face_coverage_min: initialData?.face_coverage_min ?? 0.5,
            face_coverage_max: initialData?.face_coverage_max ?? 0.7,
            description: initialData?.description ?? "",
            source_url: initialData?.source_url ?? "",
            is_active: initialData?.is_active ?? true,
        },
    })

    async function onSubmit(values: FormValues) {
        setLoading(true)
        try {
            if (initialData) {
                // Update
                const { error } = await supabase
                    .from('photo_specs')
                    .update(values)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('photo_specs')
                    .insert([values])
                if (error) throw error
            }
            router.push('/admin/presets')
            router.refresh()
        } catch (error) {
            console.error('Error saving preset:', error)
            alert('Failed to save preset. Check console for details.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-card p-6 rounded-lg border">
                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="display_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="UPSC Civil Services" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code (URL Slug)</FormLabel>
                                <FormControl>
                                    <Input placeholder="upsc-cse-photo" {...field} />
                                </FormControl>
                                <FormDescription>Unique identifier like `exam-name`</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="width_px"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Width (px)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="height_px"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height (px)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="aspect_ratio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aspect Ratio</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="file_size_min_kb"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Min Size (KB)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="file_size_max_kb"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Size (KB)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="background_color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="white" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Active Status</FormLabel>
                                    <FormDescription>
                                        Visible on homepage?
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Brief details about the photo requirements..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="source_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Official Source URL (PDF)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Preset
                </Button>
            </form>
        </Form>
    )
}
