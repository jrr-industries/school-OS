import { useAuthStore } from '@schoolos/hooks';
import { WIDGET_PERMISSIONS } from '../constants/widgets';

export function useWidgetPermission(widgetId: string): boolean {
  const requiredPermission = WIDGET_PERMISSIONS[widgetId];
  if (!requiredPermission) return true;
  return useAuthStore((state) => state.hasPermission(requiredPermission));
}

export function useVisibleWidgets(widgetIds: string[]): string[] {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  return widgetIds.filter((id) => {
    const requiredPermission = WIDGET_PERMISSIONS[id];
    if (!requiredPermission) return true;
    return hasPermission(requiredPermission);
  });
}
