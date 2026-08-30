const fs = require('fs');

const path = 'src/components/TopicDetailsDrawer.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace MAIN DRAWER BODY opener
content = content.replace(
  `          {/* ==================== 2. MAIN DRAWER BODY ==================== */}
          <div className="flex-1 overflow-y-auto bg-white flex flex-col">
            {activeHeaderTab === 'tasks' && (
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-4 space-y-4">`,
  `          {/* ==================== 2. MAIN MODAL BODY ==================== */}
          <div className="flex-1 overflow-hidden flex flex-row bg-[#F8FAFC]">
            {/* LEFT COLUMN: Tasks List */}
            <div className="w-[45%] max-w-[420px] shrink-0 border-r border-[#E2E8F0] overflow-y-auto bg-white flex flex-col">
              {activeHeaderTab === 'tasks' ? (
                <div className="flex-1 flex flex-col">
                  <div className="px-4 py-4 space-y-4">`
);

// 2. Replace TASK DETAIL SECTION transition
content = content.replace(
  `                <div className="h-px bg-[#E2E8F0] w-full" />
                {/* TASK DETAIL SECTION */}
                {activeTask && (
                  <div className="px-4 py-4 space-y-4">`,
  `                </div>
              ) : (
                <div className="flex-1 p-8 flex items-center justify-center text-[13px] text-[#64748B]">
                  Content for {activeHeaderTab}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Task Details */}
            <div className="flex-1 overflow-y-auto flex flex-col bg-[#F8FAFC]">
              {activeHeaderTab === 'tasks' && activeTask ? (
                <div className="p-4 sm:p-6 lg:p-8 space-y-6">`
);

// 3. Find the closing tags for activeHeaderTab === 'tasks' at the bottom of the file
// The end of the file looks like:
/*
                )}
              </div>
            )}
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
*/
// Actually I need to close the `activeTask ? (` instead of `activeTask && (`
// Wait, if I used `activeHeaderTab === 'tasks' && activeTask ? (`
// Then I need to change `)}` to `) : null}` or something.
// Or just keep `activeTask && (`!
// Let me change the replacement to use `activeHeaderTab === 'tasks' && activeTask && (`

