'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Palette, Upload, Save, Eye } from 'lucide-react';

export default function BrandingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Branding</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize the platform's visual identity</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Upload Logo</p>
                  <p className="text-xs text-muted-foreground">PNG, SVG, or JPG. Recommended size: 256x256px</p>
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Choose File
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">ICO or PNG, 32x32px</p>
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Choose File
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      defaultValue="#2563eb"
                      className="h-10 w-14 rounded-md border border-input bg-background p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue="#2563eb"
                      className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      defaultValue="#8b5cf6"
                      className="h-10 w-14 rounded-md border border-input bg-background p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue="#8b5cf6"
                      className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-950">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#2563eb] text-white text-sm font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#2563eb' }}>SchoolOS</p>
                  <p className="text-xs text-muted-foreground">Education Platform</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-4 flex gap-2">
                  <span className="rounded bg-[#2563eb] px-3 py-1 text-xs text-white">Button</span>
                  <span className="rounded bg-[#8b5cf6] px-3 py-1 text-xs text-white">Accent</span>
                  <span className="rounded border border-slate-300 px-3 py-1 text-xs dark:border-slate-600">Outline</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Preview updates as you change the branding options above.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
