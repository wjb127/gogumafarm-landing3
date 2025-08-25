"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown, Trophy } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

interface Top10Item {
  id: string
  title: string
  order_index: number
  is_active: boolean
}

export default function Top10ManagementPage() {
  const [items, setItems] = useState<Top10Item[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Top10Item>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState({
    title: "",
    is_active: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("kmong_12_top10_items")
      .select("*")
      .order("order_index")
    
    if (data && !error) {
      setItems(data)
    }
    setLoading(false)
  }

  const handleEdit = (item: Top10Item) => {
    setEditingId(item.id)
    setEditForm({
      title: item.title,
      is_active: item.is_active
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    const { error } = await supabase
      .from("kmong_12_top10_items")
      .update({
        title: editForm.title,
        is_active: editForm.is_active,
        updated_at: new Date().toISOString()
      })
      .eq("id", editingId)

    if (!error) {
      await fetchItems()
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from("kmong_12_top10_items")
        .delete()
        .eq("id", id)

      if (!error) {
        // 순서 재정렬
        const remainingItems = items.filter(item => item.id !== id)
        await Promise.all(
          remainingItems.map((item, index) =>
            supabase
              .from("kmong_12_top10_items")
              .update({ order_index: index })
              .eq("id", item.id)
          )
        )
        await fetchItems()
      }
    }
  }

  const handleAdd = async () => {
    const { error } = await supabase
      .from("kmong_12_top10_items")
      .insert({
        title: newForm.title,
        order_index: items.length,
        is_active: newForm.is_active
      })

    if (!error) {
      await fetchItems()
      setIsAdding(false)
      setNewForm({ title: "", is_active: true })
    }
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = items.findIndex(item => item.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[newIndex]
    newItems[newIndex] = temp

    await Promise.all([
      supabase.from("kmong_12_top10_items").update({ order_index: index }).eq("id", newItems[index].id),
      supabase.from("kmong_12_top10_items").update({ order_index: newIndex }).eq("id", newItems[newIndex].id)
    ])

    await fetchItems()
  }

  const handleToggleActive = async (id: string, is_active: boolean) => {
    await supabase
      .from("kmong_12_top10_items")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
    
    await fetchItems()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TOP 10 관리</h1>
          <p className="text-gray-600 mt-2">인기 아티클 TOP 10을 관리합니다</p>
        </div>
        {!isAdding && items.length < 10 && (
          <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            새 아이템 추가
          </Button>
        )}
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            현재 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">전체 아이템</p>
              <p className="text-2xl font-bold">{items.length}/10</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">활성 아이템</p>
              <p className="text-2xl font-bold text-green-600">
                {items.filter(item => item.is_active).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">비활성 아이템</p>
              <p className="text-2xl font-bold text-gray-400">
                {items.filter(item => !item.is_active).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">남은 슬롯</p>
              <p className="text-2xl font-bold text-purple-600">
                {10 - items.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle>새 TOP 10 아이템 추가</CardTitle>
                <CardDescription>순위 #{items.length + 1}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>제목</Label>
                  <Input 
                    placeholder="아티클 제목을 입력하세요"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={newForm.is_active}
                    onCheckedChange={(checked) => setNewForm({ ...newForm, is_active: checked })}
                  />
                  <Label>활성화</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <Input 
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={editForm.is_active}
                        onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                      />
                      <Label>활성화</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" className="bg-purple-600 hover:bg-purple-700">
                        저장
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white
                      ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-600" : "bg-purple-600"}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={item.is_active}
                      onCheckedChange={(checked) => handleToggleActive(item.id, checked)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleMove(item.id, "up")} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleMove(item.id, "down")} disabled={index === items.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}