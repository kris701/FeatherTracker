import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { PermissionModel } from '../../../../../models/Core/permissionModel';
import { PermissionsTable } from '../../../../../../PermissionsTable';

@Component({
    selector: 'app-core-components-permissionseditor',
    imports: [FormsModule, CommonModule, ButtonModule, DrawerModule, TableModule, TagModule, TreeModule],
    template: `
        @if (selected && selected.length > 0) {
            <p-button [label]="'Permissions (' + selected.length + ')'" icon="pi pi-lock-open" (click)="isVisible = true" fluid />
        } @else {
            <p-button label="Permissions" icon="pi pi-lock-open" (click)="isVisible = true" fluid />
        }
        <p-drawer [(visible)]="isVisible" header="Permissions" [style]="{ 'min-width': '40vw' }">
            <div class="flex flex-wrap gap-2 mb-6">
                <p-button icon="pi pi-plus" label="Expand all" (click)="expandAll()" />
                <p-button icon="pi pi-minus" label="Collapse all" (click)="collapseAll()" />
            </div>
            <p-tree [value]="items" selectionMode="checkbox" styleClass="w-full md:w-[30rem]" [(selection)]="selectedItems" (onNodeSelect)="nodeSelectionChanged()" (onNodeUnselect)="nodeSelectionChanged()" [filter]="true" filterPlaceholder="Search">
                <ng-template let-node pTemplate="default">
                    <p class="text-surface-500">{{ node.key }}</p>
                    <b>{{ node.label }}</b>
                    @if (node.data) {
                        <p class="text-surface-300">{{ node.data.description }}</p>
                    }
                </ng-template>
            </p-tree>
        </p-drawer>
    `
})
export class PermissionsEditor implements OnChanges {
    @Input() options: PermissionModel[] = [];
    @Input() selected: string[] = [];
    @Input() allowStaff: boolean = false;
    @Output() selectedChange = new EventEmitter<string[]>();

    lastSelected: string[] = [];
    isVisible: boolean = false;
    items!: TreeNode[];
    selectedItems!: TreeNode[];
    iconMap: { [key: string]: string } = {
        'core.user': 'pi pi-user'  
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selected'] && this.lastSelected != changes['selected'].currentValue) {
            this.lastSelected = changes['selected'].currentValue;
            this.loadTree();
        } 
        else if (changes['options'] && changes['options'].previousValue != changes['options'].currentValue) 
            this.loadTree();
        else if (changes['allowStaff'] && changes['allowStaff'].previousValue != changes['allowStaff'].currentValue) 
            this.loadTree();
    }

    loadTree() {
        if (!this.selected) return;
        this.items = [];
        this.selectedItems = [];
        var newItems: TreeNode[] = [];
        this.options.forEach((i) => {
            var icon: string | null = null;
            if (!i.isStaff || this.allowStaff){
                if (i.isStaff) icon = 'pi pi-crown';
                if (icon == null) icon = this.iconMap[i.id];
                var newNode = {
                    key: i.id,
                    label: i.name,
                    data: i,
                    icon: icon
                } as TreeNode;
                newItems.push(newNode);
            }
        });
        var newTree = this.buildTree(newItems, [], 0, '');
        this.items = newTree.tree;
        this.selectedItems = newTree.selected;
    }

    buildTree(items: TreeNode[], selected: TreeNode[], offset: number, path: string): { tree: TreeNode[]; selected: TreeNode[] } {
        var needed: string[] = [];
        var newItems: TreeNode[] = [];
        items.forEach((x) => {
            if (this.selected.includes(<string>x.key) && !selected.includes(x)) selected.push(x);

            var split = x.key?.split('.');
            if (split && split.length - 1 > offset) {
                if (!needed.includes(split[offset])) needed.push(split[offset]);
            } else newItems.push(x);
        });
        if (needed.length > 0) {
            needed.forEach((x) => {
                var subPath = path;
                if (subPath == '') subPath = x;
                else subPath += '.' + x;
                var subSet = items.filter((y) => y.key?.startsWith(subPath));
                var subTree = this.buildTree(subSet, selected, offset + 1, subPath);
                var icon: string | null = null;
                var isStaff = subTree.tree.every((y) => y.data.isStaff);
                if (isStaff) icon = 'pi pi-crown';
                if (icon == null) icon = this.iconMap[subPath];
                if (icon == null && subTree.tree.length > 0 && subTree.tree.every((y) => y.icon == subTree.tree[0].icon)) icon = <string>subTree.tree[0].icon;
                var selectedCount = subTree.tree.filter((y) => selected.includes(y)).length;
                var newNode = {
                    key: subPath,
                    icon: icon,
                    data: { id: '', isStaff: isStaff } as PermissionModel,
                    children: subTree.tree,
                    partialSelected: (selectedCount > 0 && selectedCount != subTree.tree.length) || subTree.tree.some((y) => y.partialSelected)
                } as TreeNode;
                if (selectedCount == subTree.tree.length) selected.push(newNode);
                newItems.splice(0, 0, newNode);
            });
            return { tree: newItems, selected: selected };
        }
        return { tree: items, selected: selected };
    }

    nodeSelectionChanged() {
        var newSelected: string[] = [];
        this.selectedItems.filter((x) => x.data.id != '').forEach((x) => newSelected.push(<string>x.key));
        this.selected = newSelected;
        this.lastSelected = this.selected;
        this.selectedChange.emit(this.selected);
    }

    expandAll() {
        this.items.forEach((node) => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.items.forEach((node) => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach((childNode) => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }
}
