const scheduleFrame = (callback) => {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 0);
  }
};

export function generateStandardDataset({
  parentCount,
  childCount,
  maxDepth = 1,
  includePredecessor = true,
  dateByGroup = false,
  chainGroups = false,
  commonDate = false,
  chainDates = false,
  chunkSize: requestedChunkSize
}) {
  const total = parentCount * (1 + childCount);
  const chunkSize = requestedChunkSize || (total > 60000 ? 4000 : 2000);
  const records = new Array(total);
  const taskDates = new Map();
  const levelIds = [];
  const randomProgress = () => Math.floor(Math.random() * 100);
  let index = 0;
  let id = 0;
  let groupRootId = null;
  let groupStartDate = null;

  return new Promise((resolve, reject) => {
    const fillChunk = () => {
      try {
        const end = Math.min(index + chunkSize, total);
        for (; index < end; index += 1) {
          const childIndex = index % (childCount + 1);
          const groupIndex = Math.floor(index / (childCount + 1));
          if (childIndex === 0) {
            const parentId = ++id;
            groupStartDate = dateByGroup || commonDate || chainDates
              ? new Date(2017, 1, 9 + (
                commonDate ? 0 : (chainDates ? groupIndex * 5 : groupIndex * (maxDepth + 1))
              ))
              : null;
            groupRootId = parentId;
            levelIds.length = 0;
            levelIds.push([parentId]);
            taskDates.set(parentId, groupStartDate);
            records[index] = {
              ID: parentId,
              TaskName: `Task ${parentId}`,
              StartDate: groupStartDate || new Date(2017, 1, 9),
              Duration: '5',
              Progress: randomProgress(),
              ParentId: null,
              Predecessor: includePredecessor && chainGroups && groupIndex > 0
                ? String(parentId - (childCount + 1))
                : ''
            };
          } else {
            const childId = ++id;
            const depth = maxDepth === 1
              ? 1
              : Math.min(maxDepth, Math.ceil((childIndex * maxDepth) / childCount));
            const parentIds = levelIds[depth - 1];
            const parentId = maxDepth === 1
              ? groupRootId
              : parentIds[(childIndex - 1) % parentIds.length];
            const taskDate = (dateByGroup || commonDate || chainDates) && depth < maxDepth
              ? new Date(
                groupStartDate.getFullYear(),
                groupStartDate.getMonth(),
                groupStartDate.getDate() + depth
              )
              : (dateByGroup || commonDate || chainDates ? taskDates.get(parentId) : null);

            if (!levelIds[depth]) levelIds[depth] = [];
            levelIds[depth].push(childId);
            taskDates.set(childId, taskDate);
            records[index] = {
              ID: childId,
              TaskName: `Task ${childId}`,
              StartDate: taskDate || new Date(2017, 1, 7),
              Duration: '5',
              Progress: randomProgress(),
              ParentId: parentId,
              Predecessor: includePredecessor ? String(childId - 1) : ''
            };
          }
        }

        if (index < total) scheduleFrame(fillChunk);
        else resolve(records);
      } catch (error) {
        reject(error);
      }
    };

    setTimeout(fillChunk, 0);
  });
}

export function generateHierarchyStressDataset(targetRecords, depth, {
  chunkSize: requestedChunkSize
} = {}) {
  const safeDepth = Math.max(depth, 2);
  const total = Math.ceil(targetRecords / safeDepth) * safeDepth;
  const chunkSize = requestedChunkSize || (total > 60000 ? 4000 : 2000);
  const records = new Array(total);
  const projectStart = new Date(2017, 1, 9);
  const projectDays = 730;
  const randomProgress = () => Math.floor(Math.random() * 100);
  let index = 0;

  return new Promise((resolve, reject) => {
    const fillChunk = () => {
      try {
        const end = Math.min(index + chunkSize, total);
        while (index < end) {
          const position = index;
          const level = position % safeDepth;
          const id = position + 1;
          const parentId = level === 0 ? null : id - 1;
          const chainStartDay = Math.floor(position / safeDepth);
          const stride = Math.max(1, Math.floor(
            projectDays / Math.max(Math.ceil(total / safeDepth), 1)
          ));
          const dayOffset = Math.min(chainStartDay * stride, projectDays - 1) + level;

          records[index] = {
            ID: id,
            TaskName: `Task ${id}`,
            StartDate: new Date(
              projectStart.getFullYear(),
              projectStart.getMonth(),
              projectStart.getDate() + dayOffset
            ),
            Duration: String(2 + ((id * 7) % 11)),
            Progress: randomProgress(),
            ParentId: parentId,
            Predecessor: parentId === null ? '' : `${parentId}FS+1d`
          };
          index += 1;
        }

        if (index < total) scheduleFrame(fillChunk);
        else resolve(records);
      } catch (error) {
        reject(error);
      }
    };

    setTimeout(fillChunk, 0);
  });
}
