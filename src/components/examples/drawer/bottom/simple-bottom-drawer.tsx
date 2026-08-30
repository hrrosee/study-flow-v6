import React from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer"

const SimpleBottomDrawer = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
        Open Drawer
      </button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Drawer Title</DrawerTitle>
        <DrawerDescription>
          This is a simple bottom drawer with header and footer.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <p className="text-slate-600 text-sm">
          Add your content here. This drawer slides up from the bottom.
        </p>
      </div>
      <DrawerFooter>
        <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
          Submit
        </button>
        <DrawerClose asChild>
          <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors">
            Cancel
          </button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)

export default SimpleBottomDrawer
