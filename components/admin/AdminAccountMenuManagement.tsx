import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { SettingsMenuItem } from '../../types';
import { AVAILABLE_ICONS, PRO_ICONS, DEFAULT_SETTINGS_MENU_ITEMS } from '../../constants';
import { UserIcon, XMarkIcon, ArrowUpTrayIcon, ImageIcon, ChevronDownIcon, ChevronRightIcon, TrashIcon } from '../Icons';
import DynamicIcon from '../DynamicIcon';
import UrlSelector from './UrlSelector';

const AdminAccountMenuManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [menuItems, setMenuItems] = useState<SettingsMenuItem[]>(generalSettings.accountMenuItems);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setMenuItems(generalSettings.accountMenuItems);
    }, [generalSettings.accountMenuItems]);

    const handleItemChange = (index: number, field: keyof SettingsMenuItem, value: any) => {
        const newItems = [...menuItems];
        (newItems[index] as any)[field] = value;
        setMenuItems(newItems);
        setHasChanges(true);
    };

    const handleAddItem = () => {
        setMenuItems([...menuItems, { id: `menu-${Date.now()}`, label: 'Nouveau lien', link: 'profile', icon: 'SparklesIcon' }]);
        setHasChanges(true);
    };

    const handleRemoveItem = (index: number) => {
        setMenuItems(menuItems.filter((_, i) => i !== index));
        setHasChanges(true);
    };

    const handleSave = () => {
        updateGeneralSettings({ ...generalSettings, accountMenuItems: menuItems });
        setHasChanges(false);
    };
    
    const handleReset = () => {
        if (window.confirm("Réinitialiser le menu du compte par défaut ?")) {
            setMenuItems(DEFAULT_SETTINGS_MENU_ITEMS);
            setHasChanges(true);
        }
    };

    const IconPicker: React.FC<{ onSelect: (icon: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
        <div className="absolute z-10 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-60 overflow-y-auto">
            <div className="p-2">
                <input type="text" placeholder="Rechercher une icône..." className="w-full input-style mb-2" />
            </div>
            <div className="grid grid-cols-5 gap-2 p-2">
                {Object.keys(AVAILABLE_ICONS).map(iconName => (
                    <button key={iconName} onClick={() => { onSelect(iconName); onClose(); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
                        <DynamicIcon icon={iconName} className="w-6 h-6" />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <UserIcon className="w-7 h-7" />
                <span>Gestion du Menu "Mon Compte"</span>
            </div>
        }>
            <div className="flex justify-end gap-2 mb-4">
                <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600">Réinitialiser</button>
                <button onClick={handleAddItem} className="px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark">Ajouter un lien</button>
            </div>

            <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30 space-y-3">
                {menuItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <div className="relative">
                            <button onClick={() => setIsIconPickerOpen(isIconPickerOpen === index ? null : index)} className="p-2 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                                <DynamicIcon icon={item.icon} className="w-5 h-5" />
                            </button>
                            {isIconPickerOpen === index && <IconPicker onSelect={(icon) => handleItemChange(index, 'icon', icon)} onClose={() => setIsIconPickerOpen(null)} />}
                        </div>
                        <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                            className="input-style flex-grow"
                            placeholder="Label du lien"
                        />
                        <div className="w-64">
                            <UrlSelector value={item.link} onChange={(value) => handleItemChange(index, 'link', value)} />
                        </div>
                        <button onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
            
            {hasChanges && (
                <button
                    onClick={handleSave}
                    className="fixed bottom-28 right-8 z-50 bg-accent text-white rounded-full p-4 shadow-lg"
                >
                    Sauvegarder
                </button>
            )}
        </AdminPageLayout>
    );
};

export default AdminAccountMenuManagement;