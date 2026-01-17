"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
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
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
    email: z.string().email().optional().or(z.literal("")),
    type: z.enum(["feature", "preset"]),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
})

export function FeatureRequestForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            type: "feature",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from("feature_requests")
                .insert({
                    email: values.email || null, // Handle empty string as null
                    type: values.type,
                    description: values.description,
                })

            if (error) throw error

            setIsSuccess(true)
            form.reset()
        } catch (error) {
            console.error("Error submitting request:", error)
            alert("Failed to submit request. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="max-w-md mx-auto border-green-200 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Request Submitted!</h3>
                        <p className="text-muted-foreground">
                            Thank you for your feedback. We review every request to improve docpro.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsSuccess(false)}
                        className="mt-4"
                    >
                        Submit Another Request
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Submit a Request</CardTitle>
                <CardDescription>
                    Have a feature idea or need a specific document preset? Let us know!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Type</FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...field}
                                        >
                                            <option value="feature">New Feature</option>
                                            <option value="preset">New Preset</option>
                                        </select>
                                    </FormControl>
                                    <FormDescription>
                                        Is this a new functionality or a specific ID/Photo format?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the feature or preset requirements (dimensions, background, etc.)"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Leave this if you want to be notified when we implement it.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Request"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
